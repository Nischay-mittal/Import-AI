const router = require("express").Router();
const Review = require("../models/Review");
const auth = require("../middleware/auth");

// Get all reviews
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find().sort({ order: 1, createdAt: -1 });
    return res.json(reviews);
  } catch (err) {
    console.error("Error fetching reviews:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get single review
router.get("/:id", async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    return res.json(review);
  } catch (err) {
    console.error("Error fetching review:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Create review (admin only)
router.post("/", auth, async (req, res) => {
  try {
    // Check if user is admin
    const User = require("../models/User");
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }

    const { quote, author, role, company, rating, featured, order } = req.body;
    
    if (!quote || !author || !role || !company) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const review = await Review.create({
      quote,
      author,
      role,
      company,
      rating: rating || 5,
      featured: featured || false,
      order: order || 0,
    });

    return res.status(201).json(review);
  } catch (err) {
    console.error("Error creating review:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Update review (admin only)
router.put("/:id", auth, async (req, res) => {
  try {
    // Check if user is admin
    const User = require("../models/User");
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }

    const { quote, author, role, company, rating, featured, order } = req.body;
    
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      {
        quote,
        author,
        role,
        company,
        rating,
        featured,
        order,
      },
      { new: true, runValidators: true }
    );

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    return res.json(review);
  } catch (err) {
    console.error("Error updating review:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Delete review (admin only)
router.delete("/:id", auth, async (req, res) => {
  try {
    // Check if user is admin
    const User = require("../models/User");
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }

    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    return res.json({ message: "Review deleted successfully" });
  } catch (err) {
    console.error("Error deleting review:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;

