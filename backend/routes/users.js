const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const auth = require('../middleware/auth');
const config = require('../config/config');
const validator = require('validator');

// Регистрация
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log('📝 Попытка регистрации:', { name, email });

        // Валидация имени
        if (!name || name.length < 2) {
            return res.status(400).json({ 
                message: 'Имя должно содержать минимум 2 символа' 
            });
        }

        if (name.length > 50) {
            return res.status(400).json({ 
                message: 'Имя не должно превышать 50 символов' 
            });
        }

        // Валидация email
        if (!validator.isEmail(email)) {
            return res.status(400).json({ 
                message: 'Некорректный email адрес' 
            });
        }

        // Валидация пароля
        if (!password || password.length < 8) {
            return res.status(400).json({ 
                message: 'Пароль должен содержать минимум 8 символов' 
            });
        }

        if (!/^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)) {
            return res.status(400).json({ 
                message: 'Пароль должен содержать минимум одну заглавную букву и одну цифру' 
            });
        }

        // Проверяем существующего пользователя
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            console.log('❌ Пользователь уже существует:', email);
            return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
        }

        // Создаем пользователя
        const user = new User({
            name,
            email: email.toLowerCase(),
            password
        });

        // Сохраняем с логированием
        const savedUser = await user.save();
        console.log('✅ Пользователь сохранен:', {
            id: savedUser._id,
            name: savedUser.name,
            email: savedUser.email
        });

        res.status(201).json({
            message: 'Регистрация успешна',
            user: {
                id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email
            }
        });
    } catch (error) {
        console.error('❌ Ошибка регистрации:', error);
        res.status(500).json({ message: 'Ошибка при регистрации' });
    }
});

// Логин с подробным логированием
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('🔑 Попытка входа:', { email });

        if (!email || !password) {
            return res.status(400).json({ 
                message: 'Email и пароль обязательны' 
            });
        }

        // Ищем пользователя
        const user = await User.findOne({ email: email.toLowerCase() });
        console.log('👤 Найденный пользователь:', user ? {
            id: user._id,
            email: user.email,
            passwordHash: user.password.substring(0, 10) + '...'
        } : 'не найден');

        if (!user) {
            return res.status(401).json({ 
                message: 'Неверный email или пароль' 
            });
        }

        // Проверяем пароль
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('🔒 Проверка пароля:', {
            введенныйПароль: password,
            результат: isMatch ? 'верный' : 'неверный'
        });

        if (!isMatch) {
            return res.status(401).json({ 
                message: 'Неверный email или пароль' 
            });
        }

        // Создаем токен
        const token = jwt.sign(
            { userId: user._id },
            'your-secret-key',
            { expiresIn: '24h' }
        );

        console.log('✅ Успешный вход:', {
            userId: user._id,
            email: user.email
        });

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error('❌ Ошибка входа:', error);
        res.status(500).json({ 
            message: 'Произошла ошибка при входе' 
        });
    }
});

// Получение профиля пользователя
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile' });
    }
});

module.exports = router;
