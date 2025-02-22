const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Имя обязательно'],
        trim: true,
        minlength: [2, 'Имя должно содержать минимум 2 символа'],
        maxlength: [50, 'Имя не должно превышать 50 символов']
    },
    email: {
        type: String,
        required: [true, 'Email обязателен'],
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: validator.isEmail,
            message: 'Некорректный email адрес'
        }
    },
    password: {
        type: String,
        required: [true, 'Пароль обязателен'],
        minlength: [8, 'Пароль должен содержать минимум 8 символов']
    },
    registeredAt: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    profile: {
        phone: String,
        address: String,
        preferences: [String]
    },
    rentalHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rental'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw error;
    }
};

module.exports = mongoose.model('User', userSchema);
