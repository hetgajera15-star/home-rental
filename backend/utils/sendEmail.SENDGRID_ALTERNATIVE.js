// ============================================================
// OPTIONAL: Use SendGrid instead of Gmail
// This is more reliable for production deployments
// ============================================================

// Step 1: Uncomment if using SendGrid instead of Gmail
/*
const sgMail = require('@sendgrid/mail');

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

const sendOtpEmail = async (toEmail, otp, type) => {
  try {
    if (!process.env.SENDGRID_API_KEY) {
      throw new Error("SENDGRID_API_KEY not configured");
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

    const msg = {
      to: toEmail,
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@propertyapp.com',
      subject: subject,
      html: html
    };

    await sgMail.send(msg);
    console.log(`✅ OTP email sent to ${toEmail} via SendGrid`);
  } catch (error) {
    console.error(`❌ SendGrid error for ${toEmail}:`, error.message);
    throw new Error(`SendGrid error: ${error.message}`);
  }
};

module.exports = { sendOtpEmail };
*/

// ============================================================
// HOW TO SWITCH TO SENDGRID:
// ============================================================
/*

1. Sign up at https://sendgrid.com (free tier: 100 emails/day)

2. Get your API Key:
   - Login to SendGrid
   - Go to Settings → API Keys
   - Create new API Key
   - Copy the key

3. Install SendGrid package:
   npm install @sendgrid/mail

4. Add to Render environment variables:
   SENDGRID_API_KEY = <your_api_key_from_step_2>
   SENDGRID_FROM_EMAIL = your-email@gmail.com (or verified sender)

5. Replace sendEmail.js with code above

6. Redeploy on Render

*/
