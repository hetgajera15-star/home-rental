const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: {   // 🔥 CHANGED from tenant → user
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property"
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  }
});

module.exports = mongoose.model("Booking", bookingSchema);