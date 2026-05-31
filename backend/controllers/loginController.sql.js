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
            if(login.length > 3 && password.length > 5 && hasNumber) {
                console.log("[Registration] Login and password validated.");
            } else {
                return res.status(400).send({status: 400});
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
                
                res.status(201).send({status: 201, payload: safeRegisterPayload});;
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
                // Zapisujemy ID z bazy w sesji
                req.session.userId = existingUser.id;
                req.session.userLogin = existingUser.login;

                req.session.user = {
                    id: existingUser.id,
                    login: existingUser.login
                };

                const safeLoginPayload = {
                    id: existingUser.id,
                    login: existingUser.login,
                    full_name: existingUser.full_name
                };

                return res.send({status: 200, payload: safeLoginPayload});
            } else {
                return res.status(401).send({status: 401, error: 'Błędny login lub hasło. Sprawdź dane lub zarejestruj nowe konto.'});
            }
        } catch (error) {
            console.error("Błąd logowania:", error);
            return res.status(500).json({ error: "Wystąpił błąd serwera." });
        }
    },
}

module.exports = userController;