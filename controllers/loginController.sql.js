const userModel = require('../models/userModel.sql'); 
const { handleLogin } = require('./loginController');

const userController = {

    // REJESTRACJA - Tworzymy nowe konto w bazie SQL
    handleRegister: async (req, res) => { // Dodano async
        try {
            const login = String(req.body.username || "").trim();
            const password = String(req.body.password || "");
            const full_name = String(req.body.full_name || "Nowy Użytkownik"); // Pobieramy imię
            const hasNumber = /\d/.test(password);

            //walidacja loginu i hasła
            if(login.length > 3 && password.length > 5 && hasNumber) {
                console.log("Login jest poprawny - ma więcej niż 3 znaki. Hasło jest poprawne - ma więcej niż 5 znaków oraz posiada minimum 1 cyfrę.");
            } else {
                return res.status(400).send(`
                    <script>
                        alert("Błąd: Login musi mieć min. 4 znaki, a hasło min. 6 znaków i zawierać cyfrę.");
                        window.location.href = "/register"; // powrót do formularza
                    </script>
            `);
            }

            //sprawdzenie w bazie Neon (z await!) czy użytkownik o takim loginie już istnieje
            const existingUser = await userModel.findUserByLogin(login);

            if (!existingUser) {
                // Nie generujemy już ID przez Date.now() - zrobi to baza (SERIAL)
                const newUser = {
                    full_name: full_name,
                    login: login,
                    password: password
                };

                // Zapisujemy w SQL (z await!)
                await userModel.addToDatabase(newUser);
                
                res.status(201).redirect('/login');
            } else {
                return res.status(409).send(`
                    return res.status(409).send(
                        <script>
                            alert("Ten login jest już zajęty.");
                            window.location.href = "/register";
                        </script>
                    `);
            }
        } catch (error) {
            console.error("Błąd rejestracji:", error);
            return res.status(500).send("Wystąpił błąd serwera przy rejestracji.");
        }
    },

    // LOGOWANIE - Weryfikacja danych z bazy SQL
    handleLogin: async (req, res) => { // Dodano async
        try {
            const login = String(req.body.username || "").trim();
            const password = String(req.body.password);

            //sprawdzamy czy użytkownik o danym loginie istnieje bazie
            const existingUser = await userModel.findUserByLogin(login);

            if (existingUser && existingUser.password === password) {
                // Zapisujemy ID z bazy w sesji
                req.session.userLogin = existingUser.id;
                return res.status(200).redirect('/history')
            } else {
                return res.status(401).send(`
                    <script>
                        alert("Błąd logowania: Nieprawidłowy login lub hasło.");
                        window.location.href = "/login";
                    </script>`);
            }
        } catch (error) {
            console.error("Błąd logowania:", error);
            res.status(500).send("Błąd serwera.");
        }
    },

    showLoginPage: (req, res) => {
        res.render('loginPage', {});
    },

    logout: (req, res) => {
        req.session.destroy();
        res.redirect('/login');
    }
}

module.exports = userController;