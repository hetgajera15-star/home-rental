// const express = require("express");
// const connectDB = require("./config/db");
// const cors = require("cors");
// require("dotenv").config({ path: require('path').resolve(__dirname, '.env') }); // ✅ Change karo

// const app = express();

// // DB connect
// connectDB();

// // Middleware
// app.use(express.json());
// app.use(cors());

// // Routes
// app.use("/api/auth", require("./routes/authRoutes"));
// app.use("/api/properties", require("./routes/propertyRoutes"));
// app.use("/api/bookings", require("./routes/bookingRoutes"));
// app.use("/api/payments", require("./routes/paymentRoutes"));
// app.use("/api/admin", require("./routes/adminRoutes"));

// // Root
// app.get("/", (req, res) => {
//   res.send("Backend Running 🚀");
// });

// // Server
// app.listen(5000, () => console.log("Server running on port 5000"));


const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

// Only use dotenv in local development
if (process.env.NODE_ENV !== 'production') {
  require("dotenv").config();
}

// Validate critical environment variables
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET', 'EMAIL_USER', 'EMAIL_PASS'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.warn(`⚠️ Missing environment variables: ${missingEnvVars.join(', ')}`);
  console.warn('OTP and email features will not work properly. Please configure these in your deployment environment.');
}

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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ error: err.message });
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));