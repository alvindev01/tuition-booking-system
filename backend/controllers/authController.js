const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Dummy database (for now)
const users = [];

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  const userExists = users.find(user => user.email === email);
  if (userExists) return res.status(400).json({ msg: "User already exists" });

  const hashed = await bcrypt.hash(password, 10);
  const newUser = { id: Date.now(), name, email, password: hashed, role };
  users.push(newUser);

  res.status(201).json({ msg: "User registered successfully", user: newUser });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) return res.status(400).json({ msg: "User not found" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ msg: "Invalid credentials" });

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ msg: "Login successful", token, user });
};
