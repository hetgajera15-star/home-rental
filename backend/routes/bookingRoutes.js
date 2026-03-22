const express = require("express");
const router = express.Router();

const {
  bookProperty,
  approveBooking,
  getMyBookings,
  getOwnerBookings
} = require("../controllers/bookingController");

const { protect } = require("../middleware/auth");

// ✅ Tenant books property
router.post("/", protect, bookProperty);

// ✅ Tenant bookings
router.get("/my", protect, getMyBookings);

// ✅ Owner bookings
router.get("/owner", protect, getOwnerBookings);

// ✅ Owner approves booking
router.put("/approve/:id", protect, approveBooking);

module.exports = router;