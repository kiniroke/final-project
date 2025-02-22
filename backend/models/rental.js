const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    itemType: {
        type: String,
        enum: ['Console', 'Game'],
        required: true
    },
    item: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'itemType',
        required: true
    },
    startDate: {
        type: Date,
        required: true
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
        enum: ['Active', 'Completed', 'Cancelled'],
        default: 'Active'
    }
}, {
    timestamps: true
});

rentalSchema.index({ user: 1, status: 1 });
rentalSchema.index({ item: 1, status: 1 });

// Обновляем статус консоли при создании/обновлении аренды
rentalSchema.pre('save', async function(next) {
    const Console = mongoose.model('Console');
    const console = await Console.findById(this.item);
    
    if (console) {
        console.availability.isAvailable = this.status !== 'Active';
        console.availability.nextAvailableDate = this.endDate;
        await console.save();
    }
    
    next();
});

module.exports = mongoose.model('Rental', rentalSchema);
