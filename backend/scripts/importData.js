const mongoose = require('mongoose');
const Game = require('../models/game');
const Console = require('../models/console');
const games = require('./gamesData');
const consoles = require('./consolesData');

async function importData() {
    try {
        await mongoose.connect('mongodb://localhost:27017/videoGameRentalDB');
        console.log('✅ Connected to MongoDB');
        
        // Очищаем существующие данные
        await Game.deleteMany({});
        await Console.deleteMany({});
        console.log('✅ Existing data deleted');
        
        // Импортируем новые данные
        const gamesResult = await Game.insertMany(games);
        const consolesResult = await Console.insertMany(consoles);
        
        console.log(`✅ Imported ${gamesResult.length} games`);
        console.log(`✅ Imported ${consolesResult.length} consoles`);
        
        mongoose.connection.close();
    } catch (error) {
        console.error('❌ Import error:', error);
        process.exit(1);
    }
}

// Запускаем импорт
console.log('🚀 Starting data import...');
importData(); 