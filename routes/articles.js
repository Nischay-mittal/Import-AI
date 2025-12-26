const router = require("express").Router();
const Article = require("../models/Article");
const auth = require("../middleware/auth");

// Helper function to generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

// Helper function to calculate SEO score
function calculateSEOScore(article) {
  let score = 0;
  const checks = {
    hasMetaTitle: !!article.metaTitle && article.metaTitle.length >= 50 && article.metaTitle.length <= 60,
    hasMetaDescription: !!article.metaDescription && article.metaDescription.length >= 140 && article.metaDescription.length <= 160,
    hasPrimaryKeyword: !!article.primaryKeyword,
    hasH1: article.content.includes('<h1>') || article.content.match(/^#\s/),
    hasH2: article.content.includes('<h2>') || article.content.match(/^##\s/),
    hasFeaturedImage: !!article.featuredImage?.url,
    hasAltText: !!article.featuredImage?.alt,
    hasInternalLinks: article.internalLinks && article.internalLinks.length > 0,
    hasExternalLinks: article.externalLinks && article.externalLinks.length > 0,
    wordCount: article.wordCount >= 300 && article.wordCount <= 3000,
  };
  
  // Calculate score (10 points per check)
  Object.values(checks).forEach(check => {
    if (check) score += 10;
  });
  
  return Math.min(score, 100);
}

// GET /api/articles - Get all published articles (public) or all articles (admin)
router.get("/", async (req, res) => {
  try {
    const { status, category, tag, search, page = 1, limit = 10 } = req.query;
    const query = {};
    
    // If not admin, only show published articles
    if (!req.user || req.user.role !== 'admin') {
      query.status = 'Published';
      query.publishedAt = { $lte: new Date() };
    } else if (status) {
      query.status = status;
    }
    
    if (category) {
      query.category = category;
    }
    
    if (tag) {
      query.tags = tag;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { primaryKeyword: { $regex: search, $options: 'i' } },
      ];
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const articles = await Article.find(query)
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-content'); // Don't send full content in list
    
    const total = await Article.countDocuments(query);
    
    res.json({
      articles,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({ message: "Error fetching articles", error: error.message });
  }
});

// GET /api/articles/:slug - Get single article by slug
router.get("/:slug", async (req, res) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug });
    
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    
    // Only show published articles to non-admins
    if (article.status !== 'Published' && (!req.user || req.user.role !== 'admin')) {
      return res.status(404).json({ message: "Article not found" });
    }
    
    // Increment views
    article.views += 1;
    await article.save();
    
    res.json(article);
  } catch (error) {
    console.error("Error fetching article:", error);
    res.status(500).json({ message: "Error fetching article", error: error.message });
  }
});

// POST /api/articles - Create new article (admin only)
router.post("/", auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }
    
    const articleData = req.body;
    
    // Generate slug if not provided
    if (!articleData.slug && articleData.title) {
      articleData.slug = generateSlug(articleData.title);
    }
    
    // Ensure slug is unique
    let slug = articleData.slug;
    let counter = 1;
    while (await Article.findOne({ slug })) {
      slug = `${articleData.slug}-${counter}`;
      counter++;
    }
    articleData.slug = slug;
    
    // Calculate word count
    if (articleData.content) {
      const textContent = articleData.content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
      articleData.wordCount = textContent.split(' ').filter(word => word.length > 0).length;
      articleData.readingTime = Math.ceil(articleData.wordCount / 200); // Average reading speed
    }
    
    // Calculate SEO score
    articleData.seoScore = calculateSEOScore(articleData);
    
    // Set createdBy
    articleData.createdBy = req.user.id;
    
    const article = await Article.create(articleData);
    res.status(201).json(article);
  } catch (error) {
    console.error("Error creating article:", error);
    res.status(400).json({ message: "Error creating article", error: error.message });
  }
});

// PUT /api/articles/:id - Update article (admin only)
router.put("/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }
    
    const articleData = req.body;
    
    // Update slug if title changed
    if (articleData.title && !articleData.slug) {
      articleData.slug = generateSlug(articleData.title);
      
      // Check if slug is unique (excluding current article)
      let slug = articleData.slug;
      let counter = 1;
      const existing = await Article.findOne({ slug, _id: { $ne: req.params.id } });
      if (existing) {
        while (await Article.findOne({ slug, _id: { $ne: req.params.id } })) {
          slug = `${articleData.slug}-${counter}`;
          counter++;
        }
      }
      articleData.slug = slug;
    }
    
    // Recalculate word count and reading time
    if (articleData.content) {
      const textContent = articleData.content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
      articleData.wordCount = textContent.split(' ').filter(word => word.length > 0).length;
      articleData.readingTime = Math.ceil(articleData.wordCount / 200);
    }
    
    // Recalculate SEO score
    const existingArticle = await Article.findById(req.params.id);
    const updatedData = { ...existingArticle.toObject(), ...articleData };
    articleData.seoScore = calculateSEOScore(updatedData);
    
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      articleData,
      { new: true, runValidators: true }
    );
    
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    
    res.json(article);
  } catch (error) {
    console.error("Error updating article:", error);
    res.status(400).json({ message: "Error updating article", error: error.message });
  }
});

// DELETE /api/articles/:id - Delete article (admin only)
router.delete("/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }
    
    const article = await Article.findByIdAndDelete(req.params.id);
    
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    
    res.json({ message: "Article deleted successfully" });
  } catch (error) {
    console.error("Error deleting article:", error);
    res.status(500).json({ message: "Error deleting article", error: error.message });
  }
});

// GET /api/articles/categories/list - Get all categories
router.get("/categories/list", async (req, res) => {
  try {
    const categories = await Article.distinct("category", { category: { $ne: null } });
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Error fetching categories", error: error.message });
  }
});

// GET /api/articles/tags/list - Get all tags
router.get("/tags/list", async (req, res) => {
  try {
    const tags = await Article.distinct("tags");
    res.json(tags);
  } catch (error) {
    console.error("Error fetching tags:", error);
    res.status(500).json({ message: "Error fetching tags", error: error.message });
  }
});

module.exports = router;

