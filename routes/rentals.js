const express = require('express');
const router = express.Router();
const Rental = require('../models/rental');
const Console = require('../models/console');
const Game = require('../models/game');
const auth = require('../middleware/auth');

// Get all rentals for user
router.get('/', auth, async (req, res) => {
    try {
        const rentals = await Rental.find({ user: req.user._id })
            .populate('user')
            .populate('items.item');
        res.json(rentals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single rental
router.get('/:id', auth, async (req, res) => {
    try {
        const rental = await Rental.findOne({
            _id: req.params.id,
            user: req.user._id
        })
        .populate('user')
        .populate('items.item');
        
        if (!rental) {
            return res.status(404).json({ message: 'Rental not found' });
        }
        res.json(rental);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create rental
router.post('/', auth, async (req, res) => {
    try {
        const rental = new Rental({
            ...req.body,
            user: req.user._id
        });

        // Update availability for each item
        for (const item of rental.items) {
            const Model = item.itemType === 'console' ? Console : Game;
            await Model.findByIdAndUpdate(item.item, { available: false });
        }

        await rental.save();
        res.status(201).json(rental);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Complete rental
router.patch('/:id/complete', auth, async (req, res) => {
    try {
        const rental = await Rental.findOne({
            _id: req.params.id,
            user: req.user._id,
            status: 'active'
        });

        if (!rental) {
            return res.status(404).json({ message: 'Active rental not found' });
        }

        // Update availability for each item
        for (const item of rental.items) {
            const Model = item.itemType === 'console' ? Console : Game;
            await Model.findByIdAndUpdate(item.item, { available: true });
        }

        rental.status = 'completed';
        await rental.save();
        res.json(rental);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Добавим новые маршруты
router.post('/console', auth, async (req, res) => {
    try {
        const rental = new Rental({
            user: req.user._id,
            items: [{
                itemType: 'console',
                item: req.body.consoleId,
                rentalPrice: req.body.rentalPrice
            }],
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            totalPrice: req.body.totalPrice
        });

        // Update console availability
        await Console.findByIdAndUpdate(req.body.consoleId, { available: false });
        
        await rental.save();
        res.status(201).json(rental);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.post('/game', auth, async (req, res) => {
    try {
        const rental = new Rental({
            user: req.user._id,
            items: [{
                itemType: 'game',
                item: req.body.gameId,
                rentalPrice: req.body.rentalPrice
            }],
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            totalPrice: req.body.totalPrice
        });

        // Update game availability
        await Game.findByIdAndUpdate(req.body.gameId, { available: false });
        
        await rental.save();
        res.status(201).json(rental);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get active rentals
router.get('/active', auth, async (req, res) => {
    try {
        const rentals = await Rental.find({ 
            user: req.user._id,
            status: 'active'
        })
        .populate('items.item');
        res.json(rentals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get rental history
router.get('/history', auth, async (req, res) => {
    try {
        const rentals = await Rental.find({ 
            user: req.user._id,
            status: { $in: ['completed', 'cancelled'] }
        })
        .populate('items.item');
        res.json(rentals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 