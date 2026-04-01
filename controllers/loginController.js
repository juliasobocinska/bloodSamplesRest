const userModel = require('../models/userModel'); 

const userController = {

    //rejstracja, tworzymy nowe konto użytkownika
    handleRegister: (req, res) => {
        //pobranie danych
        const login = req.body.username; 
        const password = req.body.password; 

        //sprawdzenie czy użytkownik o takim loginie już istnieje
        const existingUser = userModel.findUserByLogin(login);

        if (!existingUser) {
            const newId = Date.now(); //generowanie nowego ID
            const newUser = new userModel(newId, login, password); //tworzymy nowy obiekt klasy użytkownika

            userModel.addToDatabase(newUser);

            res.redirect('/login');
        } else {
            return res.send("Login is already being used");
        }
    },

    //weryfikacja danych i inicjalizacja sesji
    handleLogin: (req, res) => {
        const login = req.body.username;
        const password = req.body.password;

        //sprawdzamy czy użytkownik o danym loginie istnieje
        const existingLogin = userModel.findUserByLogin(login);

        if (existingLogin && existingLogin.password === password) {
            req.session.userLogin = existingLogin.id;
            res.redirect('/history');
        } else {
            return res.send(`
                <script>
                    alert("Błąd logowania: Nieprawidłowy login lub hasło. Spróbuj ponownie.");
                    window.location.href = "/login";
                </script>`)
        }
    },

    //wyświetlenie strony z formularzem logowania
    showLoginPage: (req, res) => {
        res.render('loginPage', {});
    },

    //wylogowanie, zakończenie sesji użytkownika
    logout: (req, res) => {
        req.session.destroy();
        res.redirect('/login');
    },

    //sprawdxanie czy hasło zgadza się z id użytkownika danego
    login: (req, res) => {
        const login = req.body.username;
        const password = req.body.password;

        const user = userModel.findUserByLogin(login);

        if (user) {
            if (user.password === password) 
                res.status(200).send(`Sukces! Zalogowano poprawnie! Login: ${login}, Hasło: ${password}`);
            else
                res.status(403).send(`Nieprawidłowe hasło: ${password}`);
        } else 
             res.status(403).send(`Brak użytkownika o loginie: ${login}`);
    }
}


module.exports = userController;