const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const SECRET = process.env.JWT_SECRET;

// Dummy login (replace with real DB query)
const dummyUser = {
  id: 1,
  username: "testuser",
  password: "$2b$10$HUclk8kvytU8kcPPBXx9meagmZ3frjo2C7Ve6Q3xe0dlzW7l4cbgC" // hashed password
};

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Simulate user lookup
  if (username !== dummyUser.username) {
    return res.status(401).json({ message: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, dummyUser.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid password" });
  }

  // ✅ Generate JWT
  const token = jwt.sign({ userId: dummyUser.id }, SECRET, { expiresIn: "1h" });

  res.json({ token });
});

module.exports = router;
console.log("JWT Secret:", SECRET);
