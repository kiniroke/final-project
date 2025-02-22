const mongoose = require('mongoose');
const config = require('../config/config');
const Console = require('../models/console');
const Game = require('../models/game');

const consoles = [
    {
        name: "PlayStation 5",
        brand: "Sony",
        specifications: {
            storage: "1TB",
            color: "White"
        },
        pricePerDay: 25,
        image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db",
        availability: { isAvailable: true }
    },
    {
        name: "Xbox Series X",
        brand: "Microsoft",
        specifications: {
            storage: "1TB",
            color: "Black"
        },
        pricePerDay: 25,
        image: "https://images.unsplash.com/photo-1621259182978-fbf433fd6eb7",
        availability: { isAvailable: true }
    },
    {
        name: "Nintendo Switch OLED",
        brand: "Nintendo",
        specifications: {
            storage: "64GB",
            color: "White"
        },
        pricePerDay: 20,
        image: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e",
        availability: { isAvailable: true }
    },
    {
        name: "PlayStation 4 Pro",
        brand: "Sony",
        specifications: {
            storage: "1TB",
            color: "Black"
        },
        pricePerDay: 15,
        image: "https://i.imgur.com/LFRCp0K.jpg",
        availability: { isAvailable: true }
    }
];

const games = [
    {
        title: "God of War Ragnarök",
        platform: "PlayStation 5",
        genre: "Action-Adventure",
        description: "Продолжение саги о Кратосе и Атрее в скандинавском мире",
        pricePerDay: 5,
        image: "https://images.unsplash.com/photo-1642056448791-61b7c20efb7a",
        rating: 9.5,
        availability: { isAvailable: true }
    },
    {
        title: "Spider-Man 2",
        platform: "PlayStation 5",
        genre: "Action",
        description: "Новые приключения Человека-паука в Нью-Йорке",
        pricePerDay: 5,
        image: "https://images.unsplash.com/photo-1635805737707-575885ab0820",
        rating: 9.3,
        availability: { isAvailable: true }
    },
    {
        title: "Halo Infinite",
        platform: "Xbox Series X",
        genre: "FPS",
        description: "Новая глава в легендарной саге Halo",
        pricePerDay: 5,
        image: "https://images.unsplash.com/photo-1621259182978-fbf433fd6eb7",
        rating: 8.7,
        availability: { isAvailable: true }
    },
    {
        title: "Forza Horizon 5",
        platform: "Xbox Series X",
        genre: "Racing",
        description: "Исследуйте потрясающий открытый мир Мексики",
        pricePerDay: 4,
        image: "https://i.imgur.com/YUNz2g9.jpg",
        rating: 9.2,
        availability: { isAvailable: true }
    },
    {
        title: "The Legend of Zelda: TOTK",
        platform: "Nintendo Switch",
        genre: "Action-Adventure",
        description: "Эпическое приключение в мире Хайрула",
        pricePerDay: 5,
        image: "https://i.imgur.com/8LdOZzh.jpg",
        rating: 9.8,
        availability: { isAvailable: true }
    },
    {
        title: "Mario Kart 8 Deluxe",
        platform: "Nintendo Switch",
        genre: "Racing",
        description: "Увлекательные гонки с персонажами Nintendo",
        pricePerDay: 3,
        image: "https://i.imgur.com/L5kHoB7.jpg",
        rating: 8.9,
        availability: { isAvailable: true }
    },
    {
        title: "Final Fantasy XVI",
        platform: "PlayStation 5",
        genre: "RPG",
        description: "Новая глава в легендарной серии RPG",
        pricePerDay: 5,
        image: "https://i.imgur.com/VK9PP8F.jpg",
        rating: 9.0,
        availability: { isAvailable: true }
    },
    {
        title: "Starfield",
        platform: "Xbox Series X",
        genre: "RPG",
        description: "Эпическое космическое приключение от Bethesda",
        pricePerDay: 5,
        image: "https://i.imgur.com/RKcgPuH.jpg",
        rating: 8.8,
        availability: { isAvailable: true }
    }
];

async function initDb() {
    try {
        await mongoose.connect(config.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');
        
        await Promise.all([
            Console.deleteMany({}),
            Game.deleteMany({})
        ]);
        console.log('Cleared existing data');
        
        const savedConsoles = await Console.insertMany(consoles);
        const savedGames = await Game.insertMany(games);
        
        console.log(`Added ${savedConsoles.length} consoles`);
        console.log(`Added ${savedGames.length} games`);
        console.log('Database initialized successfully');
        
        await mongoose.connection.close();
        console.log('Database connection closed');
        
        process.exit(0);
    } catch (error) {
        console.error('Error initializing database:', error);
        await mongoose.connection.close();
        process.exit(1);
    }
}

initDb(); 