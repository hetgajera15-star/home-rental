const express = require("express");
const router = express.Router();
const Payment = require("../models/Payment");
const { protect } = require("../middleware/auth");
const { makePayment } = require("../controllers/paymentController");

// Make payment
router.post("/", protect, makePayment);

// Get all payments
router.get("/", protect, async (req, res) => {
  try {
    const payments = await Payment.find().populate("booking");
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;