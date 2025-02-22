const express = require('express');
const router = express.Router();
const Console = require('../models/console');
const auth = require('../middleware/auth');
const Rental = require('../models/rental');

router.get('/', async (req, res) => {
    try {
        console.log('Fetching consoles...');
        const consoles = await Console.find();
        console.log(`Found ${consoles.length} consoles`);
        res.json(consoles);
    } catch (error) {
        console.error('Error fetching consoles:', error);
        res.status(500).json({ message: error.message });
    }
});

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

// Добавить новую консоль (только для админов)
router.post('/', auth, async (req, res) => {
    try {
        // Проверяем наличие обязательных полей
        const { name, brand, pricePerDay, image } = req.body;
        if (!name || !brand || !pricePerDay || !image) {
            return res.status(400).json({ 
                message: 'Please provide all required fields: name, brand, pricePerDay, image' 
            });
        }

        const console = new Console({
            name,
            brand,
            pricePerDay,
            image,
            specifications: req.body.specifications || {},
            availability: {
                isAvailable: true,
                nextAvailableDate: null
            }
        });

        const savedConsole = await console.save();
        res.status(201).json(savedConsole);
    } catch (error) {
        console.error('Add console error:', error);
        res.status(400).json({ 
            message: error.message || 'Error adding console',
            details: error.errors 
        });
    }
});

// Добавить рейтинг и отзыв
router.post('/:id/reviews', auth, async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const console = await Console.findById(req.params.id);

        if (!console) {
            return res.status(404).json({ message: 'Console not found' });
        }

        // Проверяем, арендовал ли пользователь эту консоль
        const rental = await Rental.findOne({
            userId: req.user.userId,
            consoleId: req.params.id,
            status: 'completed'
        });

        if (!rental) {
            return res.status(403).json({ 
                message: 'You can only review consoles you have rented' 
            });
        }

        console.ratings.push({
            userId: req.user.userId,
            rating,
            comment,
            date: new Date()
        });

        // Обновляем средний рейтинг
        console.averageRating = console.ratings.reduce((acc, curr) => 
            acc + curr.rating, 0) / console.ratings.length;

        await console.save();
        res.json(console);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Rent a console
router.post('/:id/rent', auth, async (req, res) => {
    try {
        const { rentalDays } = req.body;
        const console = await Console.findById(req.params.id);

        if (!console) {
            return res.status(404).json({ message: 'Console not found' });
        }

        if (!console.availability.isAvailable) {
            return res.status(400).json({ message: 'Console is not available' });
        }

        // Create rental
        const rental = new Rental({
            userId: req.user.userId,
            itemId: console._id,
            itemType: 'Console',
            rentalDays,
            totalPrice: console.pricePerDay * rentalDays,
            startDate: new Date()
        });

        // Update console availability
        console.availability.isAvailable = false;
        console.availability.nextAvailableDate = new Date(Date.now() + (rentalDays * 24 * 60 * 60 * 1000));

        await Promise.all([rental.save(), console.save()]);
        res.status(201).json(rental);
    } catch (error) {
        console.error('Rental error:', error);
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
