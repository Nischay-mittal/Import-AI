const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  // For Gmail, you can use OAuth2 or App Password
  // For now, using a simple SMTP configuration
  // You'll need to set these in your .env file
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail address
      pass: process.env.EMAIL_PASSWORD, // Your Gmail App Password
    },
  });
};

// Contact form submission endpoint
router.post("/submit", async (req, res) => {
  try {
    const { name, email, company, role, useCase, details } = req.body;

    // Validate required fields
    if (!name || !email || !company || !role || !useCase || !details) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Create transporter
    const transporter = createTransporter();

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER || "team@importai.in",
      to: "team@importai.in",
      cc: "snehadas.iitr@gmail.com",
      subject: `New Contact Form Submission from ${name} - ${company}`,
      html: `
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
            <p><strong>Details:</strong></p>
            <p style="white-space: pre-wrap; background-color: white; padding: 15px; border-radius: 4px;">${details}</p>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
            <p>This email was sent from the Import AI website contact form.</p>
            <p>You can reply directly to this email to contact ${name} at ${email}.</p>
          </div>
        </div>
      `,
      text: `
New Contact Form Submission

Contact Information:
- Name: ${name}
- Email: ${email}
- Company: ${company}
- Role: ${role}

Project Details:
- Use Case: ${useCase}
- Details: ${details}

---
This email was sent from the Import AI website contact form.
You can reply directly to this email to contact ${name} at ${email}.
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: "Thank you! We'll get back to you within 24 hours.",
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send message. Please try again later.",
    });
  }
});

module.exports = router;

