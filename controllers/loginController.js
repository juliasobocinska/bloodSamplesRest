const userModel = require('../models/userModel'); 

const loginController = {
    showLoginPage: (req, res) => {
        res.render('loginPage', {});
    },

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


module.exports = loginController;