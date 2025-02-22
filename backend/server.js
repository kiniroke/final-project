const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config/config');

// Отключаем предупреждение о strictQuery
mongoose.set('strictQuery', false);

const app = express();

// Настройка CORS с явными разрешениями
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:4004'],
    credentials: true
}));

app.use(express.json());

// Тестовый маршрут для проверки работы сервера
app.get('/api/test', (req, res) => {
    res.json({ message: 'Server is running' });
});

// Подключаем маршруты
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/games', require('./routes/games'));
app.use('/api/consoles', require('./routes/consoles'));
app.use('/api/rentals', require('./routes/rentals'));
app.use('/api/analytics', require('./routes/analytics'));

// Обработка ошибок
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
});

// Функция запуска сервера
const startServer = async () => {
    try {
        // Подключаемся к MongoDB
        await mongoose.connect(config.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        // Определяем порт
        const PORT = process.env.PORT || 4004;

        // Запускаем сервер
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`Test server at: http://localhost:${PORT}/api/test`);
        });

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Запускаем сервер
startServer().catch(console.error);

// Обработка завершения работы
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    mongoose.connection.close();
    process.exit(0);
});
