const consoles = [
    {
        name: "PlayStation 5",
        brand: "Sony",
        pricePerDay: 25,
        specifications: {
            storage: "1TB",
            color: "white",
            condition: "new",
            included: ["controller", "hdmi cable"]
        },
        image: "/images/ps5.jpg",
        status: {
            isAvailable: true,
            currentRental: null
        }
    },
    {
        name: "Xbox Series X",
        brand: "Microsoft",
        pricePerDay: 25,
        specifications: {
            storage: "1TB",
            color: "black",
            condition: "new",
            included: ["controller", "hdmi cable"]
        },
        image: "/images/xbox.jpg",
        status: {
            isAvailable: true,
            currentRental: null
        }
    },
    {
        name: "Nintendo Switch",
        brand: "Nintendo",
        pricePerDay: 20,
        specifications: {
            storage: "32GB",
            color: "neon",
            condition: "new",
            included: ["joy-cons", "dock", "hdmi cable"]
        },
        image: "/images/switch.jpg",
        status: {
            isAvailable: true,
            currentRental: null
        }
    }
];

module.exports = consoles; 