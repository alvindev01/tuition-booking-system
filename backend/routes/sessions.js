const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");

// Dummy route
router.get("/", verifyToken, (req, res) => {
  res.json([
    { id: 1, subject: "Math", tutor: "Mr. Ali", time: "10:00 AM" },
    { id: 2, subject: "Science", tutor: "Ms. Lina", time: "2:00 PM" }
  ]);
});

module.exports = router;
