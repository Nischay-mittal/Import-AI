const mongoose = require("mongoose");

const CaseStudySchema = new mongoose.Schema(
  {
    // Core Content Fields
    id: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function(v) {
          return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v);
        },
        message: 'ID must contain only lowercase letters, numbers, and hyphens'
      }
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    client: {
      type: String,
      trim: true,
    },
    timeline: {
      type: String,
      trim: true,
    },
    
    // For listing page
    company: {
      type: String,
      trim: true,
    },
    industry: {
      type: String,
      trim: true,
    },
    challenge: {
      type: String,
      trim: true,
    },
    solutionShort: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
    timelineShort: {
      type: String,
      trim: true,
    },
    roi: {
      type: String,
      trim: true,
    },
    
    // Detailed sections
    problem: {
      title: { type: String, default: "The Problem" },
      content: { type: String, default: "" }
    },
    solution: {
      title: { type: String, default: "What We Built" },
      content: { type: String, default: "" },
      howItWorks: {
        title: { type: String, default: "How it works:" },
        steps: [{ type: String }]
      }
    },
    results: {
      title: { type: String, default: "What Changed" },
      before: [{ type: String }],
      after: [{ type: String }],
      bottomLine: [{ type: String }]
    },
    whyItWorked: {
      title: { type: String, default: "Why It Worked" },
      content: { type: String, default: "" }
    },
    tech: [{
      type: String,
      trim: true,
    }],
    tags: [{
      type: String,
      trim: true,
    }],
    resultsShort: [{
      metric: { type: String },
      description: { type: String }
    }],
    
    // Display controls
    featured: {
      type: Boolean,
      default: false,
    },
    sortPriority: {
      type: Number,
      default: 0,
    },
    
    // Metadata
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CaseStudy", CaseStudySchema);

