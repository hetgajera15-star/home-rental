const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  title: String,
  location: String,
  price: Number,
  available: Boolean,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  approved: { type: Boolean, default: false }
});

module.exports = mongoose.model("Property", propertySchema);

