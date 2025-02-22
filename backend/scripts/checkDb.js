const mongoose = require('mongoose');
const config = require('../config/config');
const Console = require('../models/console');
const Game = require('../models/game');

async function checkDb() {
    try {
        await mongoose.connect(config.MONGODB_URI);
        console.log('Connected to MongoDB');
        
        // Проверяем консоли
        const consoles = await Console.find();
        console.log('\nConsoles in DB:');
        consoles.forEach(console => {
            console.log(`ID: ${console._id}`);
            console.log(`Name: ${console.name}`);
            console.log(`Available: ${console.availability.isAvailable}`);
            console.log('------------------------');
        });

        // Проверяем игры
        const games = await Game.find();
        console.log('\nGames in DB:');
        games.forEach(game => {
            console.log(`ID: ${game._id}`);
            console.log(`Title: ${game.title}`);
            console.log(`Available: ${game.availability.isAvailable}`);
            console.log('------------------------');
        });

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkDb(); 