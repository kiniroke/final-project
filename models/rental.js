const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        itemType: {
            type: String,
            enum: ['console', 'game'],
            required: true
        },
        item: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: 'items.itemType',
            required: true
        },
        rentalPrice: {
            type: Number,
            required: true
        }
    }],
    startDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    endDate: {
        type: Date,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'cancelled'],
        default: 'active'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Rental', rentalSchema); 