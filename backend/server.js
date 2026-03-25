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

// Load .env only in development
if (process.env.NODE_ENV !== 'production') {
  const dotenv = require("dotenv");
  dotenv.config();
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

// Middleware - CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow localhost and all vercel deployments
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
    ];
    
    // Allow all vercel.app domains and render domains
    if (!origin || 
        origin.includes('vercel.app') || 
        origin.includes('localhost') ||
        origin.includes('127.0.0.1')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handle preflight requests
app.options('*', cors(corsOptions));

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