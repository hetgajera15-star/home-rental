const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Property = require("../models/Property");
const Booking = require("../models/Booking");
const Payment = require("../models/Payment");
const { protect, adminOnly } = require("../middleware/auth");

// Get all users
router.get("/users", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete user
router.delete("/users/:id", protect, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Approve property
router.put("/approve-property/:id", protect, adminOnly, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ msg: "Property not found" });
    property.approved = true;
    await property.save();
    res.json({ msg: "Property approved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// All transactions
router.get("/transactions", protect, adminOnly, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("property");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Financial report
router.get("/financial-report", protect, adminOnly, async (req, res) => {
  try {
    const payments = await Payment.find({ status: "paid" })
      .populate("user", "name email")
      .populate("booking");
    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
    res.json({ totalRevenue, payments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;