# Render Environment Variables Setup Guide

## Problem
Your OTP emails are not being sent on Render because **environment variables are not configured in your Render deployment**. The `.env` file only works locally and is not deployed to Render.

## Solution: Set Environment Variables on Render

### Step 1: Go to Render Dashboard
1. Visit [https://dashboard.render.com](https://dashboard.render.com)
2. Log in to your account
3. Click on your backend service (e.g., "home-rental-vrbh")

### Step 2: Navigate to Environment Variables
1. In your service page, find the **"Environment"** tab on the left sidebar
2. Click on it

### Step 3: Add the Required Variables
Add each of these variables (copy from your local `.env` file):

```
KEY                  VALUE
─────────────────────────────────────────────────────────
MONGO_URI            mongodb://het:1234567890@ac-bntwuep-shard-00-00.vx8gvy7.mongodb.net:27017,ac-bntwuep-shard-00-01.vx8gvy7.mongodb.net:27017,ac-bntwuep-shard-00-02.vx8gvy7.mongodb.net:27017/?ssl=true&replicaSet=atlas-8l93qm-shard-0&authSource=admin&appName=Cluster0

JWT_SECRET           mysecret123

EMAIL_USER           hetgajera15@gmail.com

EMAIL_PASS           pxmp vtcj xgtv guqk

NODE_ENV             production

PORT                 5000
```

### Step 4: Save and Deploy
1. Click **"Save Changes"** or similar button
2. Render will **automatically redeploy** your service with the new environment variables
3. Wait 2-3 minutes for the deployment to complete

### Step 5: Test
Go to your frontend (Vercel) and try to register a new account. You should now receive the OTP email.

---

## Why This Was Not Working

- **Local `.env` file** is only used during local development
- **Render deployment** doesn't have access to your local `.env` file
- **Without environment variables on Render**, the email service cannot authenticate with Gmail

---

## Gmail Security Note

Your email credentials use a **Gmail App Password**, which is correct. Google requires this for third-party apps. Make sure:

1. Two-Factor Authentication (2FA) is enabled on your Gmail account
2. You're using an **App Password** (generated from Google Account settings), not your regular password
3. The 16-character app password is correctly copied (no spaces): `pxmpvtcjxgtvguqk`

---

## Troubleshooting

### If OTP still not working after deploying:

1. **Check Render logs**: Go to your service → Logs → Look for error messages
2. **Verify variables are set**: Go to Environment tab → confirm all variables are there
3. **Wait for deployment**: Sometimes it takes 3-5 minutes for changes to take effect
4. **Check email spam**: OTP might be in spam folder
5. **Test locally first**: Run `npm start` locally to ensure code works

### Common Issues:

- **❌ "Email service error"** → EMAIL_USER or EMAIL_PASS is missing/wrong
- **❌ Email not arriving** → Gmail might be blocking the IP (see "Gmail IP Whitelist" below)
- **❌ "Failed to send OTP"** → Check Render logs for detailed error message

---

## Gmail IP Whitelist (If Emails Still Not Arriving)

If Gmail continues blocking Render's IP addresses, you can:

### Option 1: Enable "Less Secure App Access" (Deprecated)
Google no longer supports this option for new accounts.

### Option 2: Use Gmail App Password (Your Current Setup)
This should work. Ensure 2FA is enabled:
1. Go to [Google Account Settings](https://myaccount.google.com/security)
2. Enable **"2-Step Verification"** if not already enabled
3. Go to **"App passwords"**
4. Select **"Mail"** and **"Windows Computer"** (or your device)
5. Generate new app password and use it

### Option 3: Switch to SendGrid (Recommended for Production)
SendGrid is more reliable for production deployments:

1. Sign up at [https://sendgrid.com](https://sendgrid.com) (free tier available)
2. Get your API key
3. Update `sendEmail.js` to use SendGrid instead of Gmail
4. Add environment variable: `SENDGRID_API_KEY`

---

## Deployment Checklist

- [ ] All environment variables added to Render
- [ ] Render shows "Deployment successful"
- [ ] Wait 3-5 minutes for deployment
- [ ] Test registration on Vercel frontend
- [ ] Check email (inbox + spam folder)
- [ ] Check Render logs if still not working

---

For questions, check Render's documentation: https://render.com/docs/environment-variables
