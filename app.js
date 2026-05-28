//importowanie modułów
const express = require('express');
const app = express();
const port = 3000;
const orderController = require('./controllers/orderController.sql.js'); // test nowego kontrolera
const loginController = require('./controllers/loginController.sql.js'); // test nowego kontrolera
const resultController = require('./controllers/resultController.sql.js'); // nowy kontroler wykików
const session = require('express-session');
require('./models/db'); // test bazy

//konfiguracja silnika widoków
app.set('view engine', 'ejs');

//konfiguracja sesji
app.use(session({
  secret: 'tajny_klucz_098', 
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

//parsowanie danych
app.use(express.json()); 
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

//strona główna
app.get('/', (req, res) => {
    res.render('index', {loggedIn: req.session.userLogin > 0});
});

//obsługa zamówień
app.post('/order', orderController.handleOrder);
app.get('/order', (req, res) => {
    if (req.session.userLogin > 0)
        res.render('order', {loggedIn: true})
    else
        res.redirect('/')
});

//rejstracja użytkownika
app.get('/register', (req, res) => res.render('registerPage', {loggedIn: false, err:null})); 
app.post('/register', loginController.handleRegister);

//logowanie użytkownika
app.get('/login', loginController.showLoginPage);
app.post('/login', loginController.handleLogin);

//historia i usuwanie zamówień
app.get('/history', orderController.showHistory); 
app.get('/delete/:id', orderController.deleteOrder);

//edytowanie i aktualizowanie zamówień
app.get('/edit/:id', orderController.showEditPage);
app.post('/update/:id', orderController.handleUpdate);

//wylogowanie
app.get('/logout', loginController.logout);

// Widok wyników pacjenta
app.get('/results', resultController.showMyResults);


//uruchomienie serwera
app.listen(port, () => {
  console.log(`CenterLab app listening on port ${port}!`)
});

