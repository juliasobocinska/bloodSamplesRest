//importowanie modułów
const express = require('express');
const app = express();
const port = 3000;
const orderController = require('./controllers/orderController');
const loginController = require('./controllers/loginController');
const session = require('express-session');

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
app.use(express.urlencoded({ extended: true }));

//obsługa zamówień
app.post('/order', orderController.handleOrder);

//strona główna
app.get('/', (req, res) => {
    res.render('index');
});

//rejstracja użytkownika
app.get('/register', (req, res) => res.render('registerPage')); 
app.post('/register', loginController.handleRegister);

//logowanie użytkownika
app.get('/login', loginController.showLoginPage);
app.post('/login', loginController.handleLogin);

//historia i usuwanie zamówień
app.get('/history', orderController.showList);
app.get('/delete/:id', orderController.deleteOrder);

//edytowanie i aktualizowanie zamówień
app.get('/edit/:id', orderController.showEditForm);
app.post('/update/:id', orderController.updateOrder);

//wylogowanie
app.get('/logout', loginController.logout);

//uruchomienie serwera
app.listen(port, () => {
  console.log(`Example app listening on port ${port} - nie zamykaj tego okna!`)
});

