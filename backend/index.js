require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Import Rute
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const catalogRoutes = require('./routes/catalog');

// Pasang Rute
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/catalog', catalogRoutes);

app.listen(port, () => {
  console.log(`🚀 Server ToyFolio jalan di port ${port}`);
});