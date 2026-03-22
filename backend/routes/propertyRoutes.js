const express = require("express");
const router = express.Router();
const Property = require("../models/Property");
const { addProperty, getProperties, approveProperty } = require("../controllers/propertyController");
const { protect } = require("../middleware/auth");

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ msg: "Access denied" });
    }
    next();
  };
};

// Add property (Owner only)
router.post("/", protect, authorize("owner"), addProperty);

// Get approved properties (Public)
router.get("/", getProperties);

// Get owner's own properties (Before /:id)
router.get("/owner", protect, authorize("owner"), async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user.id });
    res.json(properties);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get ALL properties (Admin) (Before /:id)
router.get("/all", protect, authorize("admin"), async (req, res) => {
  try {
    const properties = await Property.find();
    res.json(properties);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Approve property (Admin only)
router.put("/approve/:id", protect, authorize("admin"), approveProperty);

// ✅ Get single property by ID (Before delete /:id)
router.get("/:id", async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate("owner", "name email");
    if (!property) {
      return res.status(404).json({ msg: "Property not found" });
    }
    res.json(property);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete property (Owner/Admin)
router.delete("/:id", protect, authorize("owner", "admin"), async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ msg: "Property not found" });

    if (req.user.role === "owner" && property.owner.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Access denied: Not your property" });
    }

    await Property.findByIdAndDelete(req.params.id);
    res.json({ msg: "Property deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;