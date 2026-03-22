const Booking = require("../models/Booking");
const Property = require("../models/Property");

// Book property
exports.bookProperty = async (req, res) => {
  try {
    const { property } = req.body;

    const existingBooking = await Booking.findOne({
      property,
      status: { $in: ["approved", "pending"] }
    });

    if (existingBooking) {
      return res.status(400).json({ msg: "Already booked" });
    }

    const booking = await Booking.create({
      user: req.user.id,
      property,
      status: "pending"
    });

    res.json(booking);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Approve booking
exports.approveBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ msg: "Booking not found" });
    }

    booking.status = "approved";
    await booking.save();

    res.json({ msg: "Approved" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// My bookings
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate("property");

    res.json(bookings);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOwnerBookings = async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user.id });
    const propertyIds = properties.map(p => p._id);

    const bookings = await Booking.find({ property: { $in: propertyIds } })
      .populate("property")
      .populate("user", "name email");

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};