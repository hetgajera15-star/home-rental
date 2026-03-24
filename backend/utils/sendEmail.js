const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,     // your Gmail address
    pass: process.env.EMAIL_PASS      // Gmail App Password (not your normal password)
  }
});

const sendOtpEmail = async (toEmail, otp, type) => {
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

  await transporter.sendMail({
    from: `"Property App" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject,
    html
  });
};

module.exports = { sendOtpEmail };
