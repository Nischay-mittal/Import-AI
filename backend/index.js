require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

// Validate required environment variables
if (!process.env.JWT_SECRET) {
  console.error("ERROR: JWT_SECRET is required but not set in environment variables");
  process.exit(1);
}

if (!process.env.MONGODB_URI) {
  console.error("ERROR: MONGODB_URI is required but not set in environment variables");
  process.exit(1);
}

const app = express();

// Configure CORS
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:8080";
const corsOptions = {
  origin: frontendUrl,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Health check endpoint
app.get("/health", (req, res) => res.json({ status: "ok" }));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, { dbName: "importai" })
  .then(() => console.log("✓ MongoDB connected successfully"))
  .catch((err) => {
    console.error("✗ MongoDB connection failed:", err.message);
    process.exit(1);
  });

app.use("/api/auth", require("./routes/auth"));

// Simple redirect to open the Demos page from the backend
app.get("/go/demos", (req, res) => {
  const frontend = process.env.FRONTEND_URL || "http://localhost:8080";
  return res.redirect(302, `${frontend}/demos`);
});

// Redirect to contact page for demo booking
app.get("/go/contact", (req, res) => {
  const frontend = process.env.FRONTEND_URL || "http://localhost:8080";
  return res.redirect(302, `${frontend}/contact`);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✓ Server started successfully`);
  console.log(`✓ Listening on port ${PORT}`);
  console.log(`✓ CORS enabled for: ${frontendUrl}`);
});
