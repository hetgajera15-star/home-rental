const Property = require("../models/Property");

// Add Property (Owner)
exports.addProperty = async (req, res) => {
  try {
    const property = await Property.create({
      ...req.body,
      owner: req.user.id,
      approved: false,
      available: true
    });
    res.status(201).json(property);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Properties (Public) - NO available filter
exports.getProperties = async (req, res) => {
  try {
    const Booking = require("../models/Booking");
    const properties = await Property.find({ approved: true })
      .populate("owner", "name email");

    // Check which properties are booked
    const propertiesWithStatus = await Promise.all(
      properties.map(async (p) => {
        const booking = await Booking.findOne({
          property: p._id,
          status: { $in: ["pending", "approved"] }
        });
        return {
          ...p.toObject(),
          isBooked: !!booking
        };
      })
    );

    res.json(propertiesWithStatus);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Approve Property (Admin)
exports.approveProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ msg: "Property not found" });
    }
    property.approved = true;
    await property.save();
    res.json({ msg: "Property approved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};