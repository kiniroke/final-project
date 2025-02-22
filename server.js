const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./backend/config/database');
const userRoutes = require('./backend/routes/users');
const gameRoutes = require('./backend/routes/games');
const consoleRoutes = require('./backend/routes/consoles');
const rentalRoutes = require('./backend/routes/rentals');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/users', userRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/consoles', consoleRoutes);
app.use('/api/rentals', rentalRoutes);

// Test route
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 4004;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 