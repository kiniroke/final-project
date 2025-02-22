const jwt = require('jsonwebtoken');
const config = require('../config/config');

module.exports = function(req, res, next) {
    // Получаем токен из заголовка
    const token = req.header('Authorization')?.replace('Bearer ', '');

    // Проверяем наличие токена
    if (!token) {
        return res.status(401).json({ message: 'Нет токена, авторизация отклонена' });
    }

    try {
        // Верификация токена
        const decoded = jwt.verify(token, config.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Токен недействителен' });
    }
};
