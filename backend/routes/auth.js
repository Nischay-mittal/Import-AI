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
    { id: user._id, email: user.email },
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
    const user = await User.create({ name, email, password: hash });
    const token = signToken(user);
    console.log("User registered successfully:", user._id);
    return res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
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
        name: user.name
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.userId).lean();
  if (!user) return res.status(404).json({ message: "Not found" });
  const { password, ...safe } = user;
  return res.json(safe);
});

module.exports = router;
