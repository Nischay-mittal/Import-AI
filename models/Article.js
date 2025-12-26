const mongoose = require("mongoose");

const ArticleSchema = new mongoose.Schema(
  {
    // Core Content Fields
    title: {
      type: String,
      required: true,
      maxlength: 60,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/, // lowercase, hyphens only
    },
    
    // SEO Meta Fields
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
    
    // Content Editor
    content: {
      type: String, // Markdown or HTML
      required: true,
    },
    excerpt: {
      type: String,
      maxlength: 300,
    },
    
    // Keyword Management
    primaryKeyword: {
      type: String,
      trim: true,
    },
    secondaryKeywords: [{
      type: String,
      trim: true,
    }],
    
    // Search Intent
    searchIntent: {
      type: String,
      enum: ['Informational', 'Commercial', 'Transactional', 'Navigational'],
    },
    
    // Featured Image & Media
    featuredImage: {
      url: String,
      alt: String,
      caption: String,
    },
    images: [{
      url: String,
      alt: String,
      caption: String,
      lazyLoad: { type: Boolean, default: true },
    }],
    
    // Internal & External Links
    internalLinks: [{
      articleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Article' },
      anchorText: String,
      position: Number, // Position in content
    }],
    externalLinks: [{
      url: String,
      anchorText: String,
      position: Number,
      isBroken: { type: Boolean, default: false },
    }],
    
    // Schema & Structured Data
    schemaType: {
      type: String,
      enum: ['Article', 'BlogPosting', 'FAQ', 'HowTo'],
      default: 'Article',
    },
    faqs: [{
      question: String,
      answer: String,
    }],
    
    // Publishing Controls
    status: {
      type: String,
      enum: ['Draft', 'Review', 'Scheduled', 'Published', 'Archived'],
      default: 'Draft',
    },
    publishedAt: {
      type: Date,
    },
    scheduledAt: {
      type: Date,
    },
    
    // Author & Attribution
    author: {
      name: String,
      bio: String,
      profileImage: String,
    },
    
    // Category & Tags
    category: {
      type: String,
      trim: true,
    },
    tags: [{
      type: String,
      trim: true,
    }],
    
    // SEO Score & Metrics
    seoScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    readabilityScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    wordCount: {
      type: Number,
      default: 0,
    },
    readingTime: {
      type: Number, // in minutes
      default: 0,
    },
    
    // Performance & Analytics
    views: {
      type: Number,
      default: 0,
    },
    avgTimeOnPage: {
      type: Number, // in seconds
      default: 0,
    },
    bounceRate: {
      type: Number, // percentage
      default: 0,
    },
    scrollDepth: {
      type: Number, // percentage
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

// Index for search and filtering
ArticleSchema.index({ slug: 1 });
ArticleSchema.index({ status: 1, publishedAt: -1 });
ArticleSchema.index({ category: 1 });
ArticleSchema.index({ tags: 1 });
ArticleSchema.index({ primaryKeyword: 1 });

module.exports = mongoose.model("Article", ArticleSchema);

