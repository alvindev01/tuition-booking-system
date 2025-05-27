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
    // Start a transaction
    await pool.query('BEGIN');

    // Check if session exists and has available spots
    const sessionResult = await pool.query(
      `SELECT * FROM sessions WHERE id = $1`,
      [session_id]
    );

    if (sessionResult.rows.length === 0) {
      await pool.query('ROLLBACK');
      return res.status(404).json({ error: "Session not found" });
    }

    const session = sessionResult.rows[0];
    if (session.current_bookings >= session.max_students) {
      await pool.query('ROLLBACK');
      return res.status(400).json({ error: "Session is full" });
    }

    // Check if user already booked this session
    const existingBooking = await pool.query(
      `SELECT * FROM bookings WHERE user_id = $1 AND session_id = $2`,
      [userId, session_id]
    );

    if (existingBooking.rows.length > 0) {
      await pool.query('ROLLBACK');
      return res.status(400).json({ error: "You have already booked this session" });
    }

    // Create the booking
    const bookingResult = await pool.query(
      `INSERT INTO bookings (user_id, session_id) VALUES ($1, $2) RETURNING *`,
      [userId, session_id]
    );

    // Update session's current bookings count
    await pool.query(
      `UPDATE sessions SET current_bookings = current_bookings + 1 WHERE id = $1`,
      [session_id]
    );

    // Commit the transaction
    await pool.query('COMMIT');

    res.status(201).json(bookingResult.rows[0]);
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error("Error creating booking:", err);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;