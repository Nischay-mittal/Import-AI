const router = require("express").Router();
const Article = require("../models/Article");
const User = require("../models/User");
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
  if (!article) return 0;
  
  let score = 0;
  const checks = {
    hasMetaTitle: !!article.metaTitle && article.metaTitle.length >= 50 && article.metaTitle.length <= 60,
    hasMetaDescription: !!article.metaDescription && article.metaDescription.length >= 140 && article.metaDescription.length <= 160,
    hasPrimaryKeyword: !!article.primaryKeyword,
    hasH1: !!(article.content && (article.content.includes('<h1>') || article.content.match(/^#\s/))),
    hasH2: !!(article.content && (article.content.includes('<h2>') || article.content.match(/^##\s/))),
    hasFeaturedImage: !!article.featuredImage?.url,
    hasAltText: !!article.featuredImage?.alt,
    hasInternalLinks: !!(article.internalLinks && Array.isArray(article.internalLinks) && article.internalLinks.length > 0),
    hasExternalLinks: !!(article.externalLinks && Array.isArray(article.externalLinks) && article.externalLinks.length > 0),
    wordCount: !!(article.wordCount && article.wordCount >= 300 && article.wordCount <= 3000),
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
    let isAdmin = false;
    if (req.userId) {
      try {
        const user = await User.findById(req.userId);
        isAdmin = user && user.role === 'admin';
      } catch (err) {
        // If user lookup fails, treat as non-admin
        isAdmin = false;
      }
    }
    
    if (!isAdmin) {
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
    let isAdmin = false;
    if (req.userId) {
      try {
        const user = await User.findById(req.userId);
        isAdmin = user && user.role === 'admin';
      } catch (err) {
        // If user lookup fails, treat as non-admin
        isAdmin = false;
      }
    }
    
    if (article.status !== 'Published' && !isAdmin) {
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
    // Fetch user from database to check role
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }
    
    const articleData = req.body;
    
    // Validate required fields
    if (!articleData.title || !articleData.title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }
    
    if (!articleData.content || !articleData.content.trim()) {
      return res.status(400).json({ message: "Content is required" });
    }
    
    // Generate slug if not provided or empty
    if (!articleData.slug || !articleData.slug.trim()) {
      articleData.slug = generateSlug(articleData.title);
    }
    
    // Clean and validate slug
    if (articleData.slug) {
      articleData.slug = articleData.slug
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
      
      // Ensure slug is not empty after cleaning
      if (!articleData.slug || articleData.slug.length === 0) {
        articleData.slug = generateSlug(articleData.title);
      }
    }
    
    // Final validation - slug must exist
    if (!articleData.slug || articleData.slug.length === 0) {
      return res.status(400).json({ message: "Unable to generate valid slug from title" });
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
    articleData.createdBy = req.userId;
    
    // Clean up empty arrays and objects
    if (articleData.secondaryKeywords && articleData.secondaryKeywords.length === 0) {
      delete articleData.secondaryKeywords;
    }
    if (articleData.tags && articleData.tags.length === 0) {
      delete articleData.tags;
    }
    if (articleData.featuredImage && !articleData.featuredImage.url) {
      delete articleData.featuredImage;
    }
    
    const article = await Article.create(articleData);
    res.status(201).json(article);
  } catch (error) {
    console.error("Error creating article:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));
    
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError' && error.errors) {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: "Validation error", 
        errors: errors,
        details: error.message || "Invalid data provided"
      });
    }
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: "Duplicate entry", 
        error: "An article with this slug already exists" 
      });
    }
    
    // Safe error message extraction
    const errorMessage = error?.message || "Unknown error occurred";
    const errorDetails = error?.toString() || String(error);
    
    res.status(400).json({ 
      message: "Error creating article", 
      error: errorMessage,
      details: errorDetails
    });
  }
});

// PUT /api/articles/:id - Update article (admin only)
router.put("/:id", auth, async (req, res) => {
  try {
    // Fetch user from database to check role
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'admin') {
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
    // Fetch user from database to check role
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'admin') {
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

