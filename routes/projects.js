const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
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

// GET /api/projects - Get all published projects (public) or all projects (admin)
router.get("/", async (req, res) => {
  try {
    const { status, projectType, category, tag, search, page = 1, limit = 10 } = req.query;
    const query = {};
    
    // Check if user is admin (optional auth - don't fail if no token)
    let isAdmin = false;
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : req.cookies?.token;
    
    if (token) {
      try {
        const jwt = require("jsonwebtoken");
        if (process.env.JWT_SECRET) {
          const payload = jwt.verify(token, process.env.JWT_SECRET);
          const user = await User.findById(payload.id);
          isAdmin = user && user.role === 'admin';
        }
      } catch (err) {
        // Token invalid or user not found - treat as non-admin
        isAdmin = false;
      }
    }
    
    // If not admin, only show published and public projects
    if (!isAdmin) {
      query.status = 'Published';
      query.visibility = 'Public';
      query.publishedAt = { $lte: new Date() };
    } else if (status) {
      query.status = status;
    }
    
    if (projectType) {
      query.projectType = projectType;
    }
    
    if (category) {
      query.primaryCategory = category;
    }
    
    if (tag) {
      query.dataTags = tag;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { tagline: { $regex: search, $options: 'i' } },
        { problemSummary: { $regex: search, $options: 'i' } },
        { solutionSummary: { $regex: search, $options: 'i' } },
      ];
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Sort by featured first, then sortPriority, then date
    const sortOrder = isAdmin 
      ? { featured: -1, sortPriority: -1, updatedAt: -1, createdAt: -1 }
      : { featured: -1, sortPriority: -1, publishedAt: -1, createdAt: -1 };
    
    const projects = await Project.find(query)
      .sort(sortOrder)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-solutionSummary -architectureDescription'); // Don't send full content in list
    
    const total = await Project.countDocuments(query);
    
    res.json({
      projects,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ message: "Failed to fetch projects", error: error.message });
  }
});

// GET /api/projects/:slug - Get single project by slug
router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    
    const project = await Project.findOne({ slug });
    
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    
    // Check if user is admin to see draft/private projects
    let isAdmin = false;
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : req.cookies?.token;
    
    if (token) {
      try {
        const jwt = require("jsonwebtoken");
        if (process.env.JWT_SECRET) {
          const payload = jwt.verify(token, process.env.JWT_SECRET);
          const user = await User.findById(payload.id);
          isAdmin = user && user.role === 'admin';
        }
      } catch (err) {
        isAdmin = false;
      }
    }
    
    // If not admin, check if project is published and public
    if (!isAdmin) {
      if (project.status !== 'Published' || project.visibility !== 'Public') {
        return res.status(404).json({ message: "Project not found" });
      }
      if (project.publishedAt && project.publishedAt > new Date()) {
        return res.status(404).json({ message: "Project not found" });
      }
    }
    
    res.json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ message: "Failed to fetch project", error: error.message });
  }
});

// POST /api/projects - Create new project (admin only)
router.post("/", auth, async (req, res) => {
  try {
    // Fetch user from database to check role
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }
    
    const projectData = req.body;
    
    // Validate required fields
    if (!projectData.title || !projectData.title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }
    
    // Generate slug if not provided or empty
    if (!projectData.slug || !projectData.slug.trim()) {
      projectData.slug = generateSlug(projectData.title);
    }
    
    // Clean and validate slug
    if (projectData.slug) {
      projectData.slug = projectData.slug
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      if (!projectData.slug || projectData.slug.length === 0) {
        projectData.slug = generateSlug(projectData.title);
      }
    }
    
    // Ensure slug is unique
    let slug = projectData.slug;
    let counter = 1;
    while (await Project.findOne({ slug })) {
      slug = `${projectData.slug}-${counter}`;
      counter++;
    }
    projectData.slug = slug;
    
    // Set createdBy
    projectData.createdBy = req.userId;
    
    // Clean up empty arrays/objects
    if (projectData.dataTags && projectData.dataTags.length === 0) delete projectData.dataTags;
    if (projectData.whoFacesProblem && projectData.whoFacesProblem.length === 0) delete projectData.whoFacesProblem;
    if (projectData.workflowSteps && projectData.workflowSteps.length === 0) delete projectData.workflowSteps;
    if (projectData.toolsUsed && projectData.toolsUsed.length === 0) delete projectData.toolsUsed;
    if (projectData.metrics && projectData.metrics.length === 0) delete projectData.metrics;
    if (projectData.screenshots && projectData.screenshots.length === 0) delete projectData.screenshots;
    
    const project = new Project(projectData);
    await project.save();
    
    res.status(201).json(project);
  } catch (error) {
    console.error("Error creating project:", error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ message: "Validation error", errors });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: "Slug already exists" });
    }
    res.status(500).json({ message: "Failed to create project", error: error.message });
  }
});

// PUT /api/projects/:id - Update project (admin only)
router.put("/:id", auth, async (req, res) => {
  try {
    // Fetch user from database to check role
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }
    
    const projectData = req.body;
    
    // Validate required fields
    if (projectData.title !== undefined && !projectData.title.trim()) {
      return res.status(400).json({ message: "Title cannot be empty" });
    }
    
    // Handle slug if provided
    if (projectData.slug && projectData.slug.trim()) {
      projectData.slug = projectData.slug
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      // Check if slug is unique (excluding current project)
      const existing = await Project.findOne({ slug: projectData.slug, _id: { $ne: req.params.id } });
      if (existing) {
        return res.status(400).json({ message: "Slug already exists" });
      }
    }
    
    // Clean up empty arrays/objects
    if (projectData.dataTags && projectData.dataTags.length === 0) delete projectData.dataTags;
    if (projectData.whoFacesProblem && projectData.whoFacesProblem.length === 0) delete projectData.whoFacesProblem;
    if (projectData.workflowSteps && projectData.workflowSteps.length === 0) delete projectData.workflowSteps;
    if (projectData.toolsUsed && projectData.toolsUsed.length === 0) delete projectData.toolsUsed;
    if (projectData.metrics && projectData.metrics.length === 0) delete projectData.metrics;
    if (projectData.screenshots && projectData.screenshots.length === 0) delete projectData.screenshots;
    
    // Update lastUpdated
    projectData.lastUpdated = new Date();
    
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      projectData,
      { new: true, runValidators: true }
    );
    
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    
    res.json(project);
  } catch (error) {
    console.error("Error updating project:", error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ message: "Validation error", errors });
    }
    res.status(500).json({ message: "Failed to update project", error: error.message });
  }
});

// DELETE /api/projects/:id - Delete project (admin only)
router.delete("/:id", auth, async (req, res) => {
  try {
    // Fetch user from database to check role
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }
    
    const project = await Project.findByIdAndDelete(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ message: "Failed to delete project", error: error.message });
  }
});

module.exports = router;

