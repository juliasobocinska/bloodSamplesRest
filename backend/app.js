//importowanie modułów
const express = require('express');
const app = express();
const port = 3000;

// Importujemy nasz middleware (JWT)
const verifyToken = require('./middleware/auth');

// Importujemy kontrolery
const orderController = require('./controllers/orderController.sql.js'); 
const loginController = require('./controllers/loginController.sql.js'); 
const resultController = require('./controllers/resultController.sql.js'); 

require('./models/db'); // połączenie z bazą

// parsowanie danych (niezbędne do odbierania JSON z Frontendu)
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));


// --- ŚCIEŻKI REST API ---

// strona główna (zwraca testowy JSON)
app.get('/', (req, res) => {
    res.status(200).json({ message: "API działa poprawnie" });
});

// Rejestracja i logowanie (Publiczne - każdy ma dostęp)
app.post('/register', loginController.handleRegister);
app.post('/login', loginController.handleLogin);

// CRUD ZAMÓWIEŃ (Chronione przez verifyToken - trzeba być zalogowanym)
app.post('/orders', verifyToken, orderController.handleOrder);           // Tworzenie (POST)
app.get('/orders', verifyToken, orderController.showHistory);            // Pobieranie wszystkich (GET)
app.get('/orders/:id', verifyToken, orderController.getOrderById);       // Pobieranie pojedynczego do edycji (GET)
app.put('/orders/:id', verifyToken, orderController.handleUpdate);       // Aktualizacja (PUT)
app.delete('/orders/:id', verifyToken, orderController.deleteOrder);     // Usuwanie (DELETE)

// WYNIKI BADAŃ (Chronione)
app.get('/results', verifyToken, resultController.showMyResults);        // Pacjent sprawdza wyniki (GET)
app.post('/results', verifyToken, resultController.generateResult);      // Laborant dodaje wynik (POST)

// uruchomienie serwera
app.listen(port, () => {
  console.log(`CenterLab API listening on port ${port}!`)
});


