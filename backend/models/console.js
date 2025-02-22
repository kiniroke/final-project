const mongoose = require('mongoose');

const consoleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    specifications: {
        storage: String,
        color: String
    },
    pricePerDay: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    availability: {
        isAvailable: {
            type: Boolean,
            default: true
        },
        nextAvailableDate: Date
    }
});

consoleSchema.methods.updateAverageRating = function() {
    if (this.ratings && this.ratings.length > 0) {
        const sum = this.ratings.reduce((acc, rating) => acc + rating.score, 0);
        this.averageRating = sum / this.ratings.length;
    } else {
        this.averageRating = 0;
    }
};

module.exports = mongoose.model('Console', consoleSchema);
