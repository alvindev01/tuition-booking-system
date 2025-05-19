require("dotenv").config();

const express = require("express");
const app = express();
const pool = require("./config/db");

// ✅ Middleware
app.use(express.json());

// ✅ Route imports
const authRoutes = require("./routes/auth");
const sessionRoutes = require("./routes/sessions");
const bookingsRoutes = require("./routes/bookings");

// ✅ DB test
pool.query("SELECT NOW()", (err, result) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
  } else {
    console.log("✅ Connected to Supabase at:", result.rows[0].now);
  }
});

// ✅ Route usage (after express.json())
app.use("/auth", authRoutes);
app.use("/sessions", sessionRoutes);
app.use("/bookings", bookingsRoutes);

// ✅ Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
