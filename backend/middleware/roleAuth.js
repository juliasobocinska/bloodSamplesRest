const checkRole = (requiredRole) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(401).json({ error: "Brak dostępu. Niezidentyfikowany użytkownik." });
        }

        if (req.user.role !== requiredRole) {
            return res.status(403).json({ error: "Brak uprawnień. Ta operacja wymaga innych uprawnień." });
        }

        next();
    };
};

module.exports = checkRole;