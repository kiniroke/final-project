require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 4005,
    MONGODB_URI: 'mongodb://127.0.0.1:27017/videoGameRentalDB',
    JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
    JWT_EXPIRES_IN: '24h'
}; 