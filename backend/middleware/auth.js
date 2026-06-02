const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
    // KLUCZOWE ZABEZPIECZENIE: Przepuszczamy zapytania OPTIONS bez sprawdzania tokenu
    if (req.method === 'OPTIONS') {
        return next();
    }

    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ error: "Brak dostępu. Musisz się zalogować." });
    }

    try {
        const tokenSecret = process.env.JWT_SECRET || 'super_tajny_klucz_awaryjny';
        const decoded = jwt.verify(token, tokenSecret);
        req.user = decoded;
        next();
    } catch (error) {
        console.error("Błąd walidacji tokenu:", error.message);
        return res.status(403).json({ error: "Token jest nieprawidłowy lub wygasł. Zaloguj się ponownie." });
    }
};

module.exports = verifyToken;