const userModel = require('../models/userModel.sql'); 
const jwt = require('jsonwebtoken'); // Niezbędna biblioteka do JWT
require('dotenv').config(); // Ładowanie klucza JWT z pliku .env


const userController = {

    // REJESTRACJA - Tworzymy nowe konto i zwracamy JSON
    handleRegister: async (req, res) => {
        try {
            const login = String(req.body.username || "").trim();
            const password = String(req.body.password || "");
            const full_name = String(req.body.full_name || "Nowy Użytkownik");
            const hasNumber = /\d/.test(password);

            //walidacja loginu i hasła
            if (!(login.length > 3 && password.length > 5 && hasNumber)) {
                return res.status(400).json({ 
                    error: "Login musi mieć min. 4 znaki, a hasło min. 6 znaków i zawierać cyfrę." 
                });
            }

            // Sprawdzenie czy użytkownik już istnieje
            const existingUser = await userModel.findUserByLogin(login);

            if (!existingUser) {
                const newUser = {
                    full_name: full_name,
                    login: login,
                    password: password
                };

                await userModel.addToDatabase(newUser);

                const newlyCreatedUser = await userModel.findUserByLogin(login);

                const safeRegisterPayload = {
                    id: newlyCreatedUser ? newlyCreatedUser.id : null,
                    full_name: newUser.full_name,
                    login: newUser.login
                };
                
                return res.status(201).json({ status:201, message: "Konto utworzone pomyślnie.", payload: safeRegisterPayload });
            } else {
                return res.status(409).json({ status:409, error: "Ten login jest już zajęty." });
            }


        } catch (error) {
            console.error("Błąd rejestracji:", error);
            return res.status(500).json({ status:500, error: "Wystąpił błąd serwera przy rejestracji." });
        }
    },

    // LOGOWANIE - Weryfikacja danych i generowanie tokena JWT
    handleLogin: async (req, res) => {
        try {
            const login = String(req.body.username || "").trim();
            const password = String(req.body.password);

            //sprawdzamy czy użytkownik o danym loginie istnieje bazie
            const existingUser = await userModel.findUserByLogin(login);

            // Jeśli użytkownik istnieje i hasła się zgadzają
            if (existingUser && existingUser.password === password) {
                
                const tokenPayload = {
                id: existingUser.id,
                login: existingUser.login
                };

                const tokenSecret = process.env.JWT_SECRET || 'super_tajny_klucz_awaryjny';
                const token = jwt.sign(
                    { id: existingUser.id, login: existingUser.login, role: existingUser.role }, 
                    tokenSecret, 
                    { expiresIn: '2h' }
                );

                const safeLoginPayload = {
                    id: existingUser.id,
                    login: existingUser.login,
                    full_name: existingUser.full_name,
                    role: existingUser.role,
                    token: token
                };

                return res.send({status: 200, payload: safeLoginPayload});
            } else {
                return res.status(401).json({ error: "Nieprawidłowy login lub hasło." });
            }
        } catch (error) {
            console.error("Błąd logowania:", error);
            return res.status(500).json({ error: "Wystąpił błąd serwera." });
        }
    },
}

module.exports = userController;