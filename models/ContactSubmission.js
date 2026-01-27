const mongoose = require("mongoose");

const contactSubmissionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    useCase: { type: String, required: true, trim: true },
    details: { type: String, required: true, trim: true },
    budget: { type: String, trim: true },
    ipAddress: { type: String },
    userAgent: { type: String },
  },
  { timestamps: true }
);

// Index for efficient queries
contactSubmissionSchema.index({ createdAt: -1 });
contactSubmissionSchema.index({ email: 1 });

module.exports = mongoose.model("ContactSubmission", contactSubmissionSchema);


