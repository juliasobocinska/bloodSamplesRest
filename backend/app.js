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
    res.send({status: 200});
});

//rejstracja użytkownika 
app.post('/register', loginController.handleRegister);

//logowanie użytkownika
app.post('/login', loginController.handleLogin);

// CRUD in order
app.post('/orders', orderController.handleOrder);
app.get('/orders', orderController.showHistory); 
app.patch('/orders/:id', orderController.showEditPage);
app.delete('/orders/:id', orderController.deleteOrder);

// Widok wyników pacjenta
app.get('/results', resultController.showMyResults);


//uruchomienie serwera
app.listen(port, () => {
  console.log(`CenterLab app listening on port ${port}!`)
});

