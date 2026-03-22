const express = require("express");
const router = express.Router();
const { register, login, getAllUsers } = require("../controllers/authController");
const { protect, adminOnly } = require("../middleware/auth");

// Register
router.post("/register", register);

// Login
router.post("/login", login);

// Get all users (Admin only)
router.get("/users", protect, adminOnly, getAllUsers);

module.exports = router;