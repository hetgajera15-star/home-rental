const nodemailer = require("nodemailer");

// Validate email credentials
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.warn("⚠️ EMAIL_USER or EMAIL_PASS not configured. OTP emails will fail.");
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,     // your Gmail address
    pass: process.env.EMAIL_PASS      // Gmail App Password (not your normal password)
  },
  logger: true,
  debug: false
});

// Verify transporter connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email transporter verification failed:", error.message);
  } else {
    console.log("✅ Email transporter ready");
  }
});

const sendOtpEmail = async (toEmail, otp, type) => {
  try {
    // Validate inputs
    if (!toEmail || !otp) {
      throw new Error("Invalid email or OTP");
    }

    const subject =
      type === "register"
        ? "Verify your email - Property App"
        : "Reset your password - Property App";

    const html = `
      <div style="font-family:sans-serif;max-width:400px;margin:auto;padding:24px;border:1px solid #eee;border-radius:8px">
        <h2 style="color:#333">${type === "register" ? "Email Verification" : "Password Reset"}</h2>
        <p>Your OTP is:</p>
        <h1 style="letter-spacing:8px;color:#4f46e5">${otp}</h1>
        <p style="color:#888;font-size:13px">This OTP is valid for <strong>5 minutes</strong>. Do not share it with anyone.</p>
      </div>
    `;

    const result = await transporter.sendMail({
      from: `"Property App" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject,
      html
    });

    console.log(`✅ OTP email sent to ${toEmail}:`, result.messageId);
    return result;
  } catch (error) {
    console.error(`❌ Failed to send OTP email to ${toEmail}:`, error.message);
    throw new Error(`Email service error: ${error.message}`);
  }
};

module.exports = { sendOtpEmail };
