require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

// Debug: Check if JWT_SECRET is loaded
if (process.env.JWT_SECRET) {
  console.log("JWT_SECRET loaded successfully");
} else {
  console.error("JWT_SECRET not found in environment variables");
}

const app = express();
app.use(cors({ origin: ["http://localhost:8080"], credentials: true }));
app.use(express.json());
app.use(cookieParser());

mongoose
  .connect(process.env.MONGODB_URI, { dbName: "importai" })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error", err));

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API listening on ${PORT}`));
