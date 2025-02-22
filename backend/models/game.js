const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    platform: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    pricePerDay: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        min: 0,
        max: 10
    },
    availability: {
        isAvailable: {
            type: Boolean,
            default: true
        },
        nextAvailableDate: Date
    }
});

module.exports = mongoose.model('Game', gameSchema); 