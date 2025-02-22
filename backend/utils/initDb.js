const Console = require('../models/console');
const User = require('../models/user');

const initializeDb = async () => {
    try {
        // Очищаем существующие данные
        await Console.deleteMany({});
        
        // Создаем тестовые консоли
        const consoles = [
            {
                name: "PlayStation 5",
                brand: "Sony",
                pricePerDay: 25,
                specifications: {
                    storage: "1TB",
                    color: "White",
                    condition: "new",
                    included: ["controller", "hdmi cable"]
                },
                availability: {
                    isAvailable: true,
                    nextAvailableDate: null
                },
                image: "/images/ps5.jpg"
            },
            {
                name: "Xbox Series X",
                brand: "Microsoft",
                pricePerDay: 25,
                specifications: {
                    storage: "1TB",
                    color: "Black",
                    condition: "new",
                    included: ["controller", "hdmi cable"]
                },
                availability: {
                    isAvailable: true,
                    nextAvailableDate: null
                },
                image: "/images/xbox.jpg"
            },
            {
                name: "Nintendo Switch",
                brand: "Nintendo",
                pricePerDay: 15,
                specifications: {
                    storage: "32GB",
                    color: "Red/Blue",
                    condition: "excellent",
                    included: ["joy-cons", "dock"]
                },
                availability: {
                    isAvailable: true,
                    nextAvailableDate: null
                },
                image: "/images/switch.jpg"
            }
        ];

        await Console.insertMany(consoles);
        console.log('Test data initialized successfully');
    } catch (error) {
        console.error('Error initializing test data:', error);
    }
};

module.exports = initializeDb; 