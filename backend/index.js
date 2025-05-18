const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 4000;
app.get('/', (req, res) => res.send('Tuition Booking API running'));
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
