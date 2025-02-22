const express = require('express');
const router = express.Router();
const Game = require('../models/game');
const auth = require('../middleware/auth');
const Rental = require('../models/rental');

// Get all games
router.get('/', async (req, res) => {
    try {
        console.log('Fetching games...');
        const games = await Game.find();
        console.log(`Found ${games.length} games`);
        res.json(games);
    } catch (error) {
        console.error('Error fetching games:', error);
        res.status(500).json({ message: error.message });
    }
});

// Get game by ID
router.get('/:id', async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);
        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }
        res.json(game);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get games by platform
router.get('/platform/:platform', async (req, res) => {
    try {
        const games = await Game.find({ platform: req.params.platform });
        res.json(games);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add new game (admin only)
router.post('/', auth, async (req, res) => {
    try {
        const game = new Game(req.body);
        await game.save();
        res.status(201).json(game);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Rent a game
router.post('/:id/rent', auth, async (req, res) => {
    try {
        const { rentalDays } = req.body;
        const game = await Game.findById(req.params.id);

        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }

        if (!game.availability.isAvailable) {
            return res.status(400).json({ message: 'Game is not available' });
        }

        // Create a rental
        const rental = new Rental({
            userId: req.user.userId,
            gameId: game._id,
            rentalDays,
            totalPrice: game.pricePerDay * rentalDays,
            startDate: new Date()
        });

        // Update game availability
        game.availability.isAvailable = false;
        game.availability.nextAvailableDate = new Date(Date.now() + (rentalDays * 24 * 60 * 60 * 1000));

        await Promise.all([rental.save(), game.save()]);
        res.status(201).json(rental);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router; 