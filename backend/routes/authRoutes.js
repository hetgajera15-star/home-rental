// const express = require("express");
// const router = express.Router();
// const { register, login, getAllUsers } = require("../controllers/authController");
// const { protect, adminOnly } = require("../middleware/auth");

// // Register
// router.post("/register", register);

// // Login
// router.post("/login", login);

// // Get all users (Admin only)
// router.get("/users", protect, adminOnly, getAllUsers);

// module.exports = router;

// =============================================
// REPLACE your existing authRoutes.js with this file
// Added: /verify-register, /forgot-password, /verify-forgot-otp, /reset-password
// =============================================

const express = require("express");
const router = express.Router();
const {
  register,
  verifyRegisterOtp,
  login,
  forgotPassword,
  verifyForgotOtp,
  resetPassword,
  getAllUsers
} = require("../controllers/authController");
const { protect, adminOnly } = require("../middleware/auth");

// Register → sends OTP (user NOT created yet)
router.post("/register", register);

// Verify OTP → user created + auto login token returned
router.post("/verify-register", verifyRegisterOtp);

// Login
router.post("/login", login);

// Forgot Password → send OTP
router.post("/forgot-password", forgotPassword);

// Verify forgot OTP → returns resetToken
router.post("/verify-forgot-otp", verifyForgotOtp);

// Reset Password using resetToken
router.post("/reset-password", resetPassword);

// Get all users (Admin only)
router.get("/users", protect, adminOnly, getAllUsers);

module.exports = router;
