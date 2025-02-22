const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../config/config');

// Регистрация
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Проверка существования пользователя
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'Пользователь уже существует' });
        }

        // Создание нового пользователя
        user = new User({
            name,
            email,
            password
        });

        // Хеширование пароля
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        // Создание JWT токена
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            config.JWT_SECRET,
            { expiresIn: config.JWT_EXPIRES_IN },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Ошибка сервера');
    }
});

// Авторизация
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Проверка существования пользователя
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Неверные учетные данные' });
        }

        // Проверка пароля
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Неверные учетные данные' });
        }

        // Создание JWT токена
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            config.JWT_SECRET,
            { expiresIn: config.JWT_EXPIRES_IN },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Ошибка сервера');
    }
});

module.exports = router; 