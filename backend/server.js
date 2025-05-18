require("dotenv").config();

const express = require("express");
const app = express();
const authRoutes = require("./routes/auth");
const sessionRoutes = require("./routes/sessions");

app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/sessions", sessionRoutes);

// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
