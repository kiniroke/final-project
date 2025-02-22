const express = require('express');
const router = express.Router();
const Rental = require('../models/rental');

router.get('/platform-stats', async (req, res) => {
    try {
        const stats = await Rental.aggregate([
            {
                $lookup: {
                    from: 'games',
                    localField: 'item',
                    foreignField: '_id',
                    as: 'gameDetails'
                }
            },
            {
                $group: {
                    _id: '$gameDetails.platform',
                    totalRentals: { $sum: 1 },
                    averagePrice: { $avg: '$totalPrice' }
                }
            }
        ]);
        res.json(stats);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/monthly-stats', async (req, res) => {
    try {
        const monthlyStats = await Rental.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: '$startDate' },
                        month: { $month: '$startDate' }
                    },
                    totalRevenue: { $sum: '$totalPrice' },
                    rentalCount: { $sum: 1 }
                }
            },
            {
                $sort: {
                    '_id.year': -1,
                    '_id.month': -1
                }
            }
        ]);
        res.json(monthlyStats);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/popular-games', async (req, res) => {
    try {
        const popularGames = await Rental.aggregate([
            {
                $match: {
                    itemType: 'Game'
                }
            },
            {
                $group: {
                    _id: '$item',
                    rentCount: { $sum: 1 },
                    totalRevenue: { $sum: '$totalPrice' }
                }
            },
            {
                $lookup: {
                    from: 'games',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'gameDetails'
                }
            },
            {
                $unwind: '$gameDetails'
            },
            {
                $project: {
                    title: '$gameDetails.title',
                    platform: '$gameDetails.platform',
                    rentCount: 1,
                    totalRevenue: 1,
                    averageRevenue: { $divide: ['$totalRevenue', '$rentCount'] }
                }
            },
            {
                $sort: { rentCount: -1 }
            },
            {
                $limit: 10
            }
        ]);
        res.json(popularGames);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router; 