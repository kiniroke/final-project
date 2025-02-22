const express = require('express');
const router = express.Router();
const Game = require('../models/game');
const auth = require('../middleware/auth');

// Get all games
router.get('/', async (req, res) => {
    try {
        const games = await Game.find().populate('console');
        res.json(games);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single game
router.get('/:id', async (req, res) => {
    try {
        const game = await Game.findById(req.params.id).populate('console');
        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }
        res.json(game);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create game (admin only)
router.post('/', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        const game = new Game(req.body);
        await game.save();
        res.status(201).json(game);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update game (admin only)
router.patch('/:id', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        const game = await Game.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }
        res.json(game);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get games by platform
router.get('/platform/:platform', async (req, res) => {
    try {
        const games = await Game.find()
            .populate({
                path: 'console',
                match: { name: req.params.platform }
            })
            .then(games => games.filter(game => game.console)); // Filter out null consoles
        res.json(games);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 