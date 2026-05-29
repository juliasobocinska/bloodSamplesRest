const userModel = require('../models/userModel.sql'); 

const userController = {

    // REJESTRACJA - Tworzymy nowe konto w bazie SQL
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
                return res.status(400)
                    .send({status: 400});
            }

            //sprawdzenie w bazie czy użytkownik o takim loginie już istnieje
            const existingUser = await userModel.findUserByLogin(login);

            if (!existingUser) {
                const newUser = {
                    full_name: full_name,
                    login: login,
                    password: password
                };

                await userModel.addToDatabase(newUser);
                
                res.status(201).send({status: 201});;
            } else {
                return res.status(409).send({status: 409});
            }
        } catch (error) {
            console.error("Błąd rejestracji:", error);
            return res.status(500).send({status: 500});
        }
    },

    // LOGOWANIE - Weryfikacja danych z bazy
    handleLogin: async (req, res) => { // Dodano async
        try {
            const login = String(req.body.username || "").trim();
            const password = String(req.body.password);

            //sprawdzamy czy użytkownik o danym loginie istnieje bazie
            const existingUser = await userModel.findUserByLogin(login);

            if (existingUser && existingUser.password === password) {
                // Zapisujemy ID z bazy w sesji
                req.session.userLogin = existingUser.id;
                return res.send({status: 200});
            } else {
                return res.status(401).send({status: 401});
            }
        } catch (error) {
            console.error("Błąd logowania:", error);
            res.status(500).send({status: 500});
        }
    },
}

module.exports = userController;