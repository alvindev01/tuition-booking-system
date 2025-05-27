const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const pool = require("../config/db");

// Get all sessions
router.get("/", verifyToken, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM sessions");
    res.json(result.rows);
  } catch (err) {
    console.error("Error reading sessions:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Get sessions by teacher ID
router.get("/teacher/:teacherId", verifyToken, async (req, res) => {
  try {
    const { teacherId } = req.params;
    const result = await pool.query(
      "SELECT * FROM sessions WHERE teacher_id = $1 ORDER BY datetime DESC",
      [teacherId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error reading teacher sessions:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Create a new session
router.post("/", verifyToken, async (req, res) => {
  try {
    const { subject, details, datetime, duration, maxStudents, teacherId } = req.body;
    
    const result = await pool.query(
      `INSERT INTO sessions 
       (subject, details, datetime, duration, max_students, teacher_id, current_bookings) 
       VALUES ($1, $2, $3, $4, $5, $6, 0) 
       RETURNING *`,
      [subject, details, datetime, duration, maxStudents, teacherId]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating session:", err);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
