const userModel = require('../models/userModel'); 

const userController = {

    //rejstracja, tworzymy nowe konto użytkownika
    handleRegister: (req, res) => {
        try {
        //pobranie danych
        const login = String(req.body.username || "").trim(); 
        const password = String(req.body.password || ""); 
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

        //sprawdzenie czy użytkownik o takim loginie już istnieje
        const existingUser = userModel.findUserByLogin(login);

        if (!existingUser) {
            const newId = Date.now(); //generowanie nowego ID
            const newUser = new userModel(newId, login, password); //tworzymy nowy obiekt klasy użytkownika

            userModel.addToDatabase(newUser);

            res.status(201).redirect('/login');
        } else {
            return res.status(409).send(`
                <script>
                alert("Login is already being used");
                window.location.href = "/register";
                </script>
                `);
        }
    } catch (error) {
        return res.status(500).send("Wystąpił błąd:" + error.message);
    }
    },

    //weryfikacja danych i inicjalizacja sesji
    handleLogin: (req, res) => {
        const login = String(req.body.username || "").trim();
        const password = String(req.body.password);

        //sprawdzamy czy użytkownik o danym loginie istnieje
        const existingLogin = userModel.findUserByLogin(login);

        if (existingLogin && existingLogin.password === password) {
            req.session.userLogin = existingLogin.id;
            res.status(200).redirect('/history');
        } else {
            return res.status(401).send(`
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
        const login = String(req.body.username || "").trim();
        const password = String(req.body.password);

        const user = userModel.findUserByLogin(login);

        if (user) {
            if (user.password === password) 
                res.status(200).send(`Sukces! Zalogowano poprawnie! Login: ${login}, Hasło: ${password}`);
            else
                res.status(401).send(`Nieprawidłowe hasło: ${password}`);
        } else 
             res.status(404).send(`Brak użytkownika o loginie: ${login}`);
    }
}


module.exports = userController;