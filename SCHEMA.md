# Database Schema

## Users Collection
```javascript
{
    email: String,
    password: String (hashed),
    name: String,
    profile: {
        phone: String,
        address: String,
        preferences: [String]
    },
    createdAt: Date
}
```

## Consoles Collection
```javascript
{
    name: String,
    brand: String,
    pricePerDay: Number,
    specifications: {
        storage: String,
        color: String,
        condition: String,
        included: [String]
    },
    availability: {
        isAvailable: Boolean,
        nextAvailableDate: Date
    },
    ratings: [{
        userId: ObjectId,
        score: Number,
        comment: String
    }],
    averageRating: Number
}
```

## Rentals Collection
```javascript
{
    userId: ObjectId,
    consoleId: ObjectId,
    startDate: Date,
    endDate: Date,
    status: String,
    totalPrice: Number,
    payment: {
        method: String,
        status: String
    }
}
``` 