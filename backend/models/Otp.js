const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  type: {
    type: String,
    enum: ["register", "forgot"],
    required: true
  },
  // Temporary user data stored until OTP is verified (for register flow)
  tempUser: {
    name: String,
    password: String,
    role: String
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300 // Auto-delete after 5 minutes
  }
});

module.exports = mongoose.model("Otp", otpSchema);
