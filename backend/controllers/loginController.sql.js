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
            if(!(login.length > 3 && password.length > 5 && hasNumber)) {
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
                
                return res.status(201).json({ message: "Konto utworzone pomyślnie." });
            } else {
                return res.status(409).json({ error: "Ten login jest już zajęty." });
            }

        } catch (error) {
            console.error("Błąd rejestracji:", error);
            return res.status(500).json({ error: "Wystąpił błąd serwera przy rejestracji." });
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
                // Generowanie Tokena JWT
                const token = jwt.sign(
                    { id: existingUser.id, login: existingUser.login }, // Dane zaszyfrowane w tokenie (payload)
                    process.env.JWT_SECRET || 'awaryjny_klucz_dla_dev', // Klucz szyfrujący
                    { expiresIn: '2h' }                                 // Token wygaśnie po 2 godzinach
                );

                // Odsyłamy token i dane użytkownika do FrontEndu
                return res.status(200).json({ 
                    message: "Zalogowano pomyślnie",
                    token: token,
                    user: { 
                        id: existingUser.id, 
                        name: existingUser.full_name 
                    }
                });

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