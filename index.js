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

// Configure CORS for production and development
const allowedOrigins = [
  "https://importai.in",
  "https://www.importai.in",
  "http://localhost:5173",
  "http://localhost:8080", // Keep for backward compatibility
  "http://localhost:8082", // Additional local port
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // Log for debugging
      console.log("CORS blocked origin:", origin);
      console.log("Allowed origins:", allowedOrigins);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

// Middleware order: JSON parser first, then CORS, then OPTIONS handler
// Increase body size limit to 10MB for case studies with images/content
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors(corsOptions));

// Safe global OPTIONS handler using middleware instead of routing
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

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
app.use("/api/contact", require("./routes/contact"));
app.use("/api/reviews", require("./routes/reviews"));
app.use("/api/articles", require("./routes/articles"));
app.use("/api/projects", require("./routes/projects"));
app.use("/api/case-studies", require("./routes/caseStudies"));

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
  console.log(`✓ CORS enabled for: ${allowedOrigins.join(", ")}`);
});
