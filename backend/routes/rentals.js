const express = require('express');
const router = express.Router();
const Rental = require('../models/rental');
const Console = require('../models/console');
const Game = require('../models/game');
const auth = require('../middleware/auth');

// Get active rentals
router.get('/active', auth, async (req, res) => {
    try {
        console.log('Getting active rentals for user:', req.user.userId);
        
        const rentals = await Rental.find({
            userId: req.user.userId,
            status: 'active'
        })
        .populate({
            path: 'itemId',
            select: 'name brand image pricePerDay specifications'
        })
        .sort('-startDate');

        console.log(`Found ${rentals.length} active rentals`);
        
        res.json(rentals);
    } catch (error) {
        console.error('Error getting active rentals:', error);
        res.status(500).json({ 
            message: 'Error getting active rentals',
            error: error.message 
        });
    }
});

// Get rental history
router.get('/history', auth, async (req, res) => {
    try {
        console.log('Getting rental history for user:', req.user.userId);
        
        const rentals = await Rental.find({
            userId: req.user.userId,
            status: { $in: ['completed', 'cancelled'] }
        })
        .populate({
            path: 'itemId',
            select: 'name brand image pricePerDay specifications'
        })
        .sort('-endDate');

        console.log(`Found ${rentals.length} historical rentals`);
        
        res.json(rentals);
    } catch (error) {
        console.error('Error getting rental history:', error);
        res.status(500).json({ 
            message: 'Error getting rental history',
            error: error.message 
        });
    }
});

// Создать новую аренду
router.post('/', auth, async (req, res) => {
    try {
        const { itemId, itemType, startDate, endDate, totalPrice } = req.body;
        console.log('Creating rental:', { itemId, itemType, startDate, endDate, totalPrice, userId: req.user.id });

        // Проверяем доступность
        const ItemModel = itemType === 'Console' ? Console : Game;
        const item = await ItemModel.findById(itemId);
        
        if (!item) {
            return res.status(404).json({ message: 'Товар не найден' });
        }

        if (!item.availability.isAvailable) {
            return res.status(400).json({ message: 'Товар недоступен для аренды' });
        }

        const rental = new Rental({
            user: req.user.id,
            item: itemId,
            itemType,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            totalPrice
        });

        // Обновляем доступность товара
        item.availability.isAvailable = false;
        item.availability.nextAvailableDate = new Date(endDate);
        
        await Promise.all([
            rental.save(),
            item.save()
        ]);

        // Получаем полные данные аренды
        const populatedRental = await Rental.findById(rental._id)
            .populate('item')
            .populate('user', 'name email');

        res.status(201).json(populatedRental);
    } catch (err) {
        console.error('Error creating rental:', err);
        res.status(500).json({ 
            message: 'Ошибка при создании аренды',
            error: err.message 
        });
    }
});

// Завершить аренду
router.patch('/:id/complete', auth, async (req, res) => {
    try {
        const rental = await Rental.findById(req.params.id);
        
        if (!rental) {
            return res.status(404).json({ message: 'Rental not found' });
        }

        if (rental.userId.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        rental.status = 'completed';
        rental.returnDate = new Date();

        let item;
        if (rental.itemType === 'Console') {
            item = await Console.findById(rental.itemId);
        } else {
            item = await Game.findById(rental.itemId);
        }

        if (item) {
            item.availability.isAvailable = true;
            item.availability.nextAvailableDate = null;
            await item.save();
        }

        await rental.save();
        res.json(rental);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
