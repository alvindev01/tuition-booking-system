const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const pool = require("../config/db");


// ✅ GET /bookings - get all bookings for current user
router.get("/", verifyToken, async (req, res) => {
  const userId = req.user.userId;

  try {
    const result = await pool.query(
      `SELECT b.id, s.subject, s.tutor, s.time, b.booked_at 
       FROM bookings b
       JOIN sessions s ON s.id = b.session_id
       WHERE b.user_id = $1`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ error: "Database error" });
  }
});


// ✅ POST /bookings - create a new booking
router.post("/", verifyToken, async (req, res) => {
  const userId = req.user.userId;
  const { session_id } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO bookings (user_id, session_id) VALUES ($1, $2) RETURNING *`,
      [userId, session_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating booking:", err);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;