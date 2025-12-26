const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
  {
    // Core Content Fields
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function(v) {
          return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v);
        },
        message: 'Slug must contain only lowercase letters, numbers, and hyphens'
      }
    },
    tagline: {
      type: String,
      trim: true,
    },
    projectType: {
      type: String,
      enum: ['Internal Project', 'R&D Experiment', 'Open-source', 'Demo / Prototype'],
      default: 'Internal Project',
    },
    status: {
      type: String,
      enum: ['Draft', 'Published', 'Archived'],
      default: 'Draft',
    },
    visibility: {
      type: String,
      enum: ['Public', 'Private'],
      default: 'Public',
    },
    
    // Categorization
    primaryCategory: {
      type: String,
      trim: true,
    },
    dataTags: [{
      type: String,
      trim: true,
    }],
    industryRelevance: {
      type: String,
      trim: true,
    },
    
    // Problem Statement
    problemSummary: {
      type: String,
      trim: true,
    },
    whoFacesProblem: [{
      type: String,
      trim: true,
    }],
    whyExistingSolutionsFail: {
      type: String,
      trim: true,
    },
    
    // Solution Overview
    solutionSummary: {
      type: String, // Markdown
    },
    workflowSteps: [{
      title: String,
      description: String,
    }],
    showBeforeAfter: {
      type: Boolean,
      default: false,
    },
    beforeState: {
      type: String,
      trim: true,
    },
    afterState: {
      type: String,
      trim: true,
    },
    
    // System Architecture
    architectureDescription: {
      type: String, // Markdown
    },
    architectureDiagram: {
      url: String,
      alt: String,
    },
    toolsUsed: [{
      type: String,
      trim: true,
    }],
    
    // Results & Benchmarks
    metrics: [{
      type: {
        type: String,
        enum: ['Time Saved', 'Cost Reduced', 'Speed Improved', 'Accuracy Improved'],
      },
      value: String,
      context: String,
    }],
    
    // Demo & Proof
    demoType: {
      type: String,
      enum: ['Live URL', 'Video', 'Screenshots', 'GitHub Repo'],
    },
    demoUrl: {
      type: String,
      trim: true,
    },
    videoUrl: {
      type: String,
      trim: true,
    },
    screenshots: [{
      url: String,
      alt: String,
      caption: String,
    }],
    githubRepo: {
      url: String,
      isPublic: {
        type: Boolean,
        default: true,
      },
    },
    
    // SEO & Metadata
    metaTitle: {
      type: String,
      maxlength: 60,
      trim: true,
    },
    metaDescription: {
      type: String,
      maxlength: 160,
      trim: true,
    },
    canonicalUrl: {
      type: String,
      trim: true,
    },
    openGraphImage: {
      url: String,
      alt: String,
    },
    schemaType: {
      type: String,
      enum: ['SoftwareApplication', 'TechArticle', 'Project'],
      default: 'Project',
    },
    
    // Admin Controls
    author: {
      name: String,
      bio: String,
      profileImage: String,
    },
    publishedAt: {
      type: Date,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    
    // Admin-Only Controls
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

// Indexes
ProjectSchema.index({ slug: 1 });
ProjectSchema.index({ status: 1, publishedAt: -1 });
ProjectSchema.index({ featured: -1, sortPriority: -1, publishedAt: -1 });
ProjectSchema.index({ projectType: 1 });
ProjectSchema.index({ primaryCategory: 1 });
ProjectSchema.index({ visibility: 1 });

module.exports = mongoose.model("Project", ProjectSchema);

