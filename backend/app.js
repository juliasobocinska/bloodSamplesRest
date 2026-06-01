// --- IMPORTY MODUŁÓW ---
const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;
const orderController = require('./controllers/orderController.sql.js'); // test nowego kontrolera
const loginController = require('./controllers/loginController.sql.js'); // test nowego kontrolera
const resultController = require('./controllers/resultController.sql.js'); // nowy kontroler wykików
const currencyController = require('./controllers/currencyController.js');
const session = require('express-session');
require('./models/db');
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true 
}));

// --- IMPORTY MIDDLEWARE I BAZY DANYCH ---
const verifyToken = require('./middleware/auth');


//----------------------------------------------
// --- IMPORTY I KONFIGURACJA SWAGGERA ---
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

// --- KONFIGURACJA SWAGGERA ---
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'CenterLab API',
            version: '1.0.0',
            description: 'Dokumentacja REST API dla systemu obsługi badań krwi',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Serwer lokalny'
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        },
        security: [{
            bearerAuth: []
        }],
    },
    // Pliki, w których Swagger ma szukać komentarzy z dokumentacją
    apis: ['./docs/*.yaml'], 
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
//----------------------------------------------

app.use(cors());

// --- KONFIGURACJA PARSOWANIA DANYCH ---
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));


// --- ŚCIEŻKI REST API ---


app.get('/', (req, res) => {
    res.status(200).json({ message: "API działa poprawnie" });
});

// Rejestracja i logowanie (Publiczne - każdy ma dostęp)
app.post('/register', loginController.handleRegister);
app.post('/login', loginController.handleLogin);

// CRUD Zamówień (Chronione przez verifyToken - trzeba być zalogowanym)
app.post('/orders', verifyToken, orderController.handleOrder);           // Tworzenie (POST)
app.get('/orders', verifyToken, orderController.showHistory);            // Pobieranie wszystkich (GET)
app.get('/orders/:id', verifyToken, orderController.getOrderById);       // Pobieranie pojedynczego do edycji (GET)
app.put('/orders/:id', verifyToken, orderController.handleUpdate);       // Aktualizacja (PUT)
app.delete('/orders/:id', verifyToken, orderController.deleteOrder);     // Usuwanie (DELETE)

// Wyniki badań (Chronione)
app.get('/results', verifyToken, resultController.showMyResults);        // Pacjent sprawdza wyniki (GET)
app.post('/results', verifyToken, resultController.generateResult);      // Laborant dodaje wynik (POST)

// Publiczny cennik z przelicznikiem walut NBP
app.get('/pricelist/:code', currencyController.getPriceListInCurrency);

// --- URUCHOMIENIE SERWERA ---
app.listen(port, () => {
  console.log(`CenterLab API listening on port ${port}!`)
});


