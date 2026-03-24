// const User = require("../models/User");
// const jwt = require("jsonwebtoken");

// exports.register = async (req, res) => {
//   try {
//     const user = await User.create(req.body);
//     res.json({ msg: "Registered successfully" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email, password });
//     if (!user) return res.status(400).json({ message: "Invalid credentials" });

//     const payload = { id: user._id, role: user.role, name: user.name };
//     const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });

//     res.json({ token, role: user.role });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.getAllUsers = async (req, res) => {
//   try {
//     const users = await User.find();
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// =============================================
// REPLACE your existing authController.js with this file
// Changes: register now sends OTP, added verifyRegisterOtp,
//          forgotPassword, verifyForgotOtp, resetPassword
// =============================================

const User = require("../models/User");
const Otp = require("../models/Otp");
const jwt = require("jsonwebtoken");
const { sendOtpEmail } = require("../utils/sendEmail");

// ── Helper ────────────────────────────────────
const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// ── STEP 1: Register → send OTP (do NOT save user yet) ───────────────
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if email already registered
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ msg: "Email already registered" });
    }

    const otp = generateOtp();

    // Delete any previous OTP for this email
    await Otp.deleteMany({ email, type: "register" });

    // Save OTP + temp user data (user is NOT saved to DB yet)
    await Otp.create({
      email,
      otp,
      type: "register",
      tempUser: { name, password, role: role || "tenant" }
    });

    await sendOtpEmail(email, otp, "register");

    res.json({ msg: "OTP sent to your email. Please verify.", email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── STEP 2: Verify OTP → actually create user ────────────────────────
exports.verifyRegisterOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const record = await Otp.findOne({ email, otp, type: "register" });
    if (!record) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    const { name, password, role } = record.tempUser;

    // Now create the real user
    const user = await User.create({ name, email, password, role });

    // Clean up OTP
    await Otp.deleteMany({ email, type: "register" });

    // Auto-login after verification
    const payload = { id: user._id, role: user.role, name: user.name };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ msg: "Email verified! Account created.", token, role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── Login (unchanged logic) ───────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const payload = { id: user._id, role: user.role, name: user.name };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── STEP 1 Forgot: send OTP to email ─────────────────────────────────
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "No account with this email" });
    }

    const otp = generateOtp();

    await Otp.deleteMany({ email, type: "forgot" });
    await Otp.create({ email, otp, type: "forgot" });

    await sendOtpEmail(email, otp, "forgot");

    res.json({ msg: "OTP sent to your email.", email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── STEP 2 Forgot: verify OTP ─────────────────────────────────────────
exports.verifyForgotOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const record = await Otp.findOne({ email, otp, type: "forgot" });
    if (!record) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    // Return a short-lived reset token so frontend can proceed to reset step
    const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "10m" });

    res.json({ msg: "OTP verified", resetToken });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── STEP 3 Forgot: set new password ──────────────────────────────────
exports.resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    let decoded;
    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    } catch {
      return res.status(400).json({ msg: "Reset token expired or invalid" });
    }

    await User.findOneAndUpdate(
      { email: decoded.email },
      { password: newPassword }
    );

    // Clean up OTP
    await Otp.deleteMany({ email: decoded.email, type: "forgot" });

    res.json({ msg: "Password reset successful! Please login." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── Get all users (Admin) ─────────────────────────────────────────────
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
