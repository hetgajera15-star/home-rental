const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
  amount: Number,
  status: {
  type: String,
  enum: ["pending", "paid"],
  default: "pending"
}
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);