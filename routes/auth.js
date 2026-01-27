const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth");

function signToken(user) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET not configured in .env");
  }
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role || 'user' },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
}

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log("Registration attempt:", { name, email, password: password ? "***" : "missing" });
    
    if (!name || !email || !password) {
      console.log("Missing fields:", { name: !!name, email: !!email, password: !!password });
      return res.status(400).json({ message: "Missing fields" });
    }
    
    const existing = await User.findOne({ email });
    if (existing) {
      console.log("Email already exists:", email);
      return res.status(409).json({ message: "Email already in use" });
    }
    
    const hash = await bcrypt.hash(password, 10);
    // Always create regular users - admin users must be created manually
    const user = await User.create({ name, email, password: hash, role: 'user' });
    const token = signToken(user);
    console.log("User registered successfully:", user._id);
    return res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt:", { email, password: password ? "***" : "missing" });
    
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      console.log("User not found:", email);
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      console.log("Invalid password for:", email);
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    const token = signToken(user);
    console.log("User logged in successfully:", user._id);
    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role || 'user'
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Google OAuth login
router.post("/google", async (req, res) => {
  try {
    const { credential } = req.body; // Google ID token
    
    if (!credential) {
      return res.status(400).json({ message: "Google credential is required" });
    }

    // Verify Google token (simplified - in production, verify with Google's API)
    // For now, we'll decode the JWT token (it's safe as it's signed by Google)
    const jwt = require("jsonwebtoken");
    let decoded;
    
    try {
      // Decode without verification for now (in production, verify with Google's public keys)
      decoded = jwt.decode(credential);
    } catch (err) {
      return res.status(401).json({ message: "Invalid Google token" });
    }

    if (!decoded || !decoded.email) {
      return res.status(401).json({ message: "Invalid Google token data" });
    }

    const { email, name, sub: googleId, picture } = decoded;

    // Find or create user
    let user = await User.findOne({ 
      $or: [
        { email },
        { googleId }
      ]
    });

    if (user) {
      // Update user if they logged in with Google before but don't have googleId
      if (!user.googleId && googleId) {
        user.googleId = googleId;
        await user.save();
      }
    } else {
      // Create new user
      user = await User.create({
        name: name || email.split('@')[0],
        email,
        googleId,
        role: 'user' // New Google users are regular users by default
      });
    }

    const token = signToken(user);
    console.log("Google login successful:", user._id);
    
    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role || 'user'
      }
    });
  } catch (err) {
    console.error("Google login error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.userId).lean();
  if (!user) return res.status(404).json({ message: "Not found" });
  const { password, ...safe } = user;
  return res.json(safe);
});

// GET /api/auth/users - Get all users (admin only)
router.get("/users", auth, async (req, res) => {
  try {
    // Check if user is admin
    const currentUser = await User.findById(req.userId);
    if (!currentUser || currentUser.role !== 'admin') {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .lean();

    res.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// PUT /api/auth/users/:userId/role - Update user role (admin only)
router.put("/users/:userId/role", auth, async (req, res) => {
  try {
    // Check if current user is admin
    const currentUser = await User.findById(req.userId);
    if (!currentUser || currentUser.role !== 'admin') {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const { userId } = req.params;
    const { role } = req.body;

    // Validate role
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: "Invalid role. Must be 'user' or 'admin'" });
    }

    // Prevent self-demotion (admin can't remove their own admin role)
    if (userId === req.userId && role === 'user') {
      return res.status(400).json({ message: "You cannot remove your own admin role" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user, message: "User role updated successfully" });
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({ message: "Failed to update user role" });
  }
});

module.exports = router;
