require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./config/db");

const app = express();

// ✅ Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// ✅ Route imports
const authRoutes = require("./routes/auth");
const sessionRoutes = require("./routes/sessions");
const bookingsRoutes = require("./routes/bookings");

// ✅ DB test
pool.connect((err, client, release) => {
  if (err) {
    console.error("❌ Error connecting to the database:", err);
    return;
  }
  console.log("✅ Successfully connected to the database");
  release();
});

// ✅ Route usage (after express.json())
app.use("/auth", authRoutes);
app.use("/sessions", sessionRoutes);
app.use("/bookings", bookingsRoutes);

// ✅ Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// ✅ Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
