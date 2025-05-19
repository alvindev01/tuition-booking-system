const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const pool = require("../config/db");

router.get("/", verifyToken, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM sessions");
    res.json(result.rows);
  } catch (err) {
    console.error("Error reading sessions:", err);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
