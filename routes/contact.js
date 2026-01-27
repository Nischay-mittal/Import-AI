const express = require("express");
const router = express.Router();
const { Resend } = require("resend");
const ContactSubmission = require("../models/ContactSubmission");
const auth = require("../middleware/auth");
const User = require("../models/User");

// Initialize Resend client
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Contact form submission endpoint
router.post("/submit", async (req, res) => {
  try {
    const { name, email, company, role, useCase, details, budget } = req.body;

    // Validate required fields
    if (!name || !email || !company || !role || !useCase || !details) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled",
      });
    }

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY || !resend) {
      console.error("Resend API key not configured");
      return res.status(500).json({
        success: false,
        message: "Email service not configured. Please contact the administrator.",
      });
    }

    // Email content
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #8b5cf6;">New Contact Form Submission</h2>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Contact Information</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Company:</strong> ${company}</p>
          <p><strong>Role:</strong> ${role}</p>
        </div>

        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Project Details</h3>
          <p><strong>Use Case:</strong> ${useCase}</p>
          ${budget ? `<p><strong>Budget:</strong> ${budget}</p>` : ''}
          <p><strong>Details:</strong></p>
          <p style="white-space: pre-wrap; background-color: white; padding: 15px; border-radius: 4px;">${details}</p>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
          <p>This email was sent from the Import AI website contact form.</p>
          <p>You can reply directly to this email to contact ${name} at ${email}.</p>
        </div>
      </div>
    `;

    const textContent = `
New Contact Form Submission

Contact Information:
- Name: ${name}
- Email: ${email}
- Company: ${company}
- Role: ${role}

Project Details:
- Use Case: ${useCase}
${budget ? `- Budget: ${budget}` : ''}
- Details: ${details}

---
This email was sent from the Import AI website contact form.
You can reply directly to this email to contact ${name} at ${email}.
    `;

    // Send email using Resend API
    try {
      // Use verified domain - team@importai.in
      const fromEmail = process.env.RESEND_FROM_EMAIL || "Import AI <team@importai.in>";
      
      // Send to primary recipient with CC
      const { data, error } = await resend.emails.send({
        from: fromEmail,
        to: ["team@importai.in"],
        cc: ["snehadas.iitr@gmail.com"],
        replyTo: email,
        subject: `New Contact Form Submission from ${name} - ${company}`,
        html: htmlContent,
        text: textContent,
      });

      if (error) {
        console.error("Resend API error:", error);
        throw new Error(error.message || "Failed to send email");
      }

      console.log("Email sent successfully via Resend:", data?.id);
      
      // Save submission to database
      const ipAddress = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];
      const userAgent = req.headers['user-agent'];
      
      await ContactSubmission.create({
        name,
        email,
        company,
        role,
        useCase,
        details,
        budget: budget || "",
        ipAddress,
        userAgent,
      });
      
      res.json({
        success: true,
        message: "Thank you! We'll get back to you within 24 hours.",
      });
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      throw emailError; // Re-throw to be caught by outer catch
    }
  } catch (error) {
    console.error("Error in contact form submission:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      emailUser: process.env.EMAIL_USER ? "Set" : "Missing",
      emailPassword: process.env.EMAIL_PASSWORD ? "Set" : "Missing",
    });
    
    // Provide more specific error message for debugging (in production, you might want to hide this)
    const errorMessage = process.env.NODE_ENV === "production" 
      ? "Failed to send message. Please try again later."
      : `Failed to send message: ${error.message}`;
    
    res.status(500).json({
      success: false,
      message: errorMessage,
    });
  }
});

// GET /api/contact/submissions - Get all contact form submissions (admin only)
router.get("/submissions", auth, async (req, res) => {
  try {
    // Check if user is admin
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const submissions = await ContactSubmission.find()
      .sort({ createdAt: -1 })
      .select('-__v');

    res.json({ submissions });
  } catch (error) {
    console.error("Error fetching contact submissions:", error);
    res.status(500).json({ message: "Failed to fetch submissions" });
  }
});

module.exports = router;

