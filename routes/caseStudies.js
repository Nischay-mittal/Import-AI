const express = require("express");
const router = express.Router();
const CaseStudy = require("../models/CaseStudy");
const User = require("../models/User");
const auth = require("../middleware/auth");

// GET /api/case-studies - Get all case studies (public) or all case studies (admin)
router.get("/", async (req, res) => {
  try {
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
    
    // For now, show all case studies to everyone (no draft/published status yet)
    // In the future, you can add a status field like projects/articles
    
    // Sort by featured first, then sortPriority, then date
    const sortOrder = { featured: -1, sortPriority: -1, createdAt: -1 };
    
    const caseStudies = await CaseStudy.find(query)
      .sort(sortOrder)
      .lean();
    
    res.json({
      caseStudies,
      total: caseStudies.length,
    });
  } catch (error) {
    console.error("Error fetching case studies:", error);
    res.status(500).json({ message: "Failed to fetch case studies", error: error.message });
  }
});

// GET /api/case-studies/:id - Get single case study by ID
router.get("/:id", async (req, res) => {
  try {
    const caseStudy = await CaseStudy.findOne({ id: req.params.id }).lean();
    
    if (!caseStudy) {
      return res.status(404).json({ message: "Case study not found" });
    }
    
    res.json({ caseStudy });
  } catch (error) {
    console.error("Error fetching case study:", error);
    res.status(500).json({ message: "Failed to fetch case study", error: error.message });
  }
});

// POST /api/case-studies - Create new case study (admin only)
router.post("/", auth, async (req, res) => {
  try {
    // Check if user is admin
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }
    
    const caseStudyData = req.body;
    
    // Check if ID already exists
    const existing = await CaseStudy.findOne({ id: caseStudyData.id });
    if (existing) {
      return res.status(409).json({ message: "Case study with this ID already exists" });
    }
    
    const caseStudy = await CaseStudy.create({
      ...caseStudyData,
      createdBy: req.userId,
    });
    
    res.status(201).json({ caseStudy, message: "Case study created successfully" });
  } catch (error) {
    console.error("Error creating case study:", error);
    res.status(500).json({ message: "Failed to create case study", error: error.message });
  }
});

// PUT /api/case-studies/:id - Update case study (admin only)
router.put("/:id", auth, async (req, res) => {
  try {
    // Check if user is admin
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }
    
    const caseStudyData = req.body;
    
    // If ID is being changed, check if new ID already exists
    if (caseStudyData.id && caseStudyData.id !== req.params.id) {
      const existing = await CaseStudy.findOne({ id: caseStudyData.id });
      if (existing) {
        return res.status(409).json({ message: "Case study with this ID already exists" });
      }
    }
    
    const caseStudy = await CaseStudy.findOneAndUpdate(
      { id: req.params.id },
      { ...caseStudyData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!caseStudy) {
      return res.status(404).json({ message: "Case study not found" });
    }
    
    res.json({ caseStudy, message: "Case study updated successfully" });
  } catch (error) {
    console.error("Error updating case study:", error);
    res.status(500).json({ message: "Failed to update case study", error: error.message });
  }
});

// DELETE /api/case-studies/:id - Delete case study (admin only)
router.delete("/:id", auth, async (req, res) => {
  try {
    // Check if user is admin
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }
    
    const caseStudy = await CaseStudy.findOneAndDelete({ id: req.params.id });
    
    if (!caseStudy) {
      return res.status(404).json({ message: "Case study not found" });
    }
    
    res.json({ message: "Case study deleted successfully" });
  } catch (error) {
    console.error("Error deleting case study:", error);
    res.status(500).json({ message: "Failed to delete case study", error: error.message });
  }
});

module.exports = router;

