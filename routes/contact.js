const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  // Validate email credentials
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    throw new Error("Email credentials not configured. EMAIL_USER and EMAIL_PASSWORD must be set.");
  }

  // For Gmail/Google Workspace, try port 465 (SSL) first, fallback to 587 (STARTTLS)
  // Port 465 with SSL is more reliable and often works better with cloud providers
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    connectionTimeout: 20000, // 20 seconds
    greetingTimeout: 20000, // 20 seconds
    socketTimeout: 20000, // 20 seconds
    tls: {
      // Do not fail on invalid certs
      rejectUnauthorized: false
    }
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

    // Check if email credentials are configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.error("Email configuration missing:", {
        EMAIL_USER: process.env.EMAIL_USER ? "Set" : "Missing",
        EMAIL_PASSWORD: process.env.EMAIL_PASSWORD ? "Set" : "Missing",
      });
      return res.status(500).json({
        success: false,
        message: "Email service not configured. Please contact the administrator.",
      });
    }

    // Create transporter
    let transporter;
    try {
      transporter = createTransporter();
      console.log("Email transporter created for:", process.env.EMAIL_USER);
    } catch (transporterError) {
      console.error("Failed to create email transporter:", transporterError);
      return res.status(500).json({
        success: false,
        message: "Email service configuration error. Please try again later.",
      });
    }

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

    // Send email with timeout
    const emailPromise = transporter.sendMail(mailOptions);
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Email sending timed out after 30 seconds")), 30000)
    );
    
    try {
      const info = await Promise.race([emailPromise, timeoutPromise]);
      console.log("Email sent successfully:", info.messageId);
      
      res.json({
        success: true,
        message: "Thank you! We'll get back to you within 24 hours.",
      });
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      console.error("Error code:", emailError.code);
      console.error("Error response:", emailError.response);
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

module.exports = router;

