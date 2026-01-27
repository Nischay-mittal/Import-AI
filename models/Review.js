const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    quote: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5, default: 5 },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 }, // For custom ordering
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);

