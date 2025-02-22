const express = require('express');
const router = express.Router();
const Console = require('../models/console');
const auth = require('../middleware/auth');

// Get all consoles
router.get('/', async (req, res) => {
    try {
        const consoles = await Console.find();
        res.json(consoles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single console
router.get('/:id', async (req, res) => {
    try {
        const console = await Console.findById(req.params.id);
        if (!console) {
            return res.status(404).json({ message: 'Console not found' });
        }
        res.json(console);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create console (admin only)
router.post('/', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        const console = new Console(req.body);
        await console.save();
        res.status(201).json(console);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update console (admin only)
router.patch('/:id', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        const console = await Console.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!console) {
            return res.status(404).json({ message: 'Console not found' });
        }
        res.json(console);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router; 