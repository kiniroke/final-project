const mongoose = require('mongoose');
const config = require('../config/config');
const Console = require('../models/console');
const Game = require('../models/game');

const consoles = [
    {
        name: "PlayStation 5",
        brand: "Sony",
        pricePerDay: 25,
        image: "https://example.com/ps5.jpg",
        specifications: {
            storage: "1TB",
            color: "White",
            condition: "New"
        },
        availability: {
            isAvailable: true,
            nextAvailableDate: null
        }
    },
    {
        name: "Xbox Series X",
        brand: "Microsoft",
        pricePerDay: 25,
        image: "https://example.com/xbox.jpg",
        specifications: {
            storage: "1TB",
            color: "Black",
            condition: "New"
        },
        availability: {
            isAvailable: true,
            nextAvailableDate: null
        }
    }
];

const games = [
    {
        title: "Spider-Man 2",
        platform: "PlayStation 5",
        genre: "Action",
        pricePerDay: 5,
        image: "https://example.com/spiderman.jpg",
        description: "Experience the latest Spider-Man adventure",
        availability: {
            isAvailable: true,
            nextAvailableDate: null
        },
        rating: 4.5
    },
    {
        title: "Starfield",
        platform: "Xbox Series X",
        genre: "RPG",
        pricePerDay: 5,
        image: "https://example.com/starfield.jpg",
        description: "Explore the vast universe in this epic RPG",
        availability: {
            isAvailable: true,
            nextAvailableDate: null
        },
        rating: 4.2
    }
];

async function initDb() {
    try {
        await mongoose.connect(config.MONGODB_URI);
        console.log('Connected to MongoDB');
        
        await Console.deleteMany({});
        await Game.deleteMany({});
        console.log('Database cleared');
        
        const createdConsoles = await Console.insertMany(consoles);
        const createdGames = await Game.insertMany(games);
        
        console.log('\nAdded Consoles:');
        createdConsoles.forEach(console => {
            console.log(`ID: ${console._id}`);
            console.log(`Name: ${console.name}`);
            console.log('------------------------');
        });

        console.log('\nAdded Games:');
        createdGames.forEach(game => {
            console.log(`ID: ${game._id}`);
            console.log(`Title: ${game.title}`);
            console.log('------------------------');
        });

        console.log('\nDatabase initialized successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

initDb(); 