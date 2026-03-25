const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
require("dotenv").config({ path: require('path').resolve(__dirname, '.env') }); // ✅ Change karo

const app = express();

// DB connect
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/properties", require("./routes/propertyRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

// Root
app.get("/", (req, res) => {
  res.send("Backend Running 🚀");
});

// Server
app.listen(5000, () => console.log("Server running on port 5000"));