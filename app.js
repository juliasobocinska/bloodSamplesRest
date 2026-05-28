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

//obsługa zamówień
app.post('/order', orderController.handleOrder);

//strona główna
app.get('/', (req, res) => {
    res.render('index', {loggedIn: req.session.userLogin > 0});
});

app.get('/order', (req, res) => {
    if (req.session.userLogin > 0)
        res.render('order', {loggedIn: true})
    else
        res.redirect('/')
});

//rejstracja użytkownika
app.get('/register', (req, res) => res.render('registerPage', {loggedIn: false})); 
app.post('/register', loginController.handleRegister);

//logowanie użytkownika
app.get('/login', loginController.showLoginPage);
app.post('/login', loginController.handleLogin);

//historia i usuwanie zamówień
app.get('/history', orderController.showHistory); 
// app.get('/history', orderController.showList);
app.get('/delete/:id', orderController.deleteOrder);

//edytowanie i aktualizowanie zamówień
app.get('/edit/:id', orderController.showEditPage);
app.post('/update/:id', orderController.handleUpdate);

//wylogowanie
app.get('/logout', loginController.logout);


// Widok wyników pacjenta
app.get('/results', resultController.showMyResults);

// TYMCZASOWY TEST WYNIKÓW - do usunięcia później
/* === ZAKOMENTOWANE NA CZAS ODDANIA PROJEKTU ===
app.get('/test-result', async (req, res) => {
    // Importujemy model z odpowiednią ścieżką
    const resultTests = require('./models/resultModel.sql.js'); // upewnij się co do nazwy pliku!
    
    try {
        const orderId = 5; // <--- Twoje ID z bazy Neon
        const testName = 'Cholesterol'; // Bierzemy badanie z zamówienia
        const value = 215; // Logika mówi: jeśli >= 200, to "Negatywny (Podwyższony)"

        const savedResult = await resultTests.saveResult(orderId, testName, value);
        
        res.send(`
            <h1>Sukces! Wynik wygenerowany.</h1>
            <p>Dane z bazy Neon:</p>
            <pre>${JSON.stringify(savedResult, null, 2)}</pre>
            <a href="/results">Przejdź do widoku pacjenta</a>
        `);
    } catch (error) {
        console.error("Błąd testu:", error);
        res.status(500).send(`Błąd podczas testu: ${error.message}`);
    }
});
================================================ */


//uruchomienie serwera
app.listen(port, () => {
  console.log(`Example app listening on port ${port} - nie zamykaj tego okna!`)
});

