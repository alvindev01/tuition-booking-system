const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const pool = require("../config/db");

const SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Fallback for development

// ✅ REGISTER
router.post("/register", async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;

  try {
    const userCheck = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userCheck.rows.length > 0) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (first_name, last_name, email, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, first_name, last_name, role",
      [firstName, lastName, email, hashedPassword, role]
    );

    const user = result.rows[0];
    const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: "1h" });

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role
      }
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Registration failed. Please try again." });
  }
});

// ✅ LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = userResult.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: "1h" });
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed. Please try again." });
  }
});

module.exports = router;
