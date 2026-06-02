// --- IMPORTY MODUŁÓW ---
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

const orderController = require('./controllers/orderController.sql.js'); 
const loginController = require('./controllers/loginController.sql.js'); 
const resultController = require('./controllers/resultController.sql.js'); 
const currencyController = require('./controllers/currencyController.js');

require('./models/db');

// --- 1. GLOBALNA KONFIGURACJA CORS (Zawsze na samej górze!) ---
app.use(cors({
    origin: 'http://localhost:5000', 
    credentials: true 
}));

// --- 2. LOGGER DO TESTÓW (Powie nam w terminalu o każdym ruchu!) ---
app.use((req, res, next) => {
    console.log(`[ŻĄDANIE] Metoda: ${req.method} | Ścieżka: ${req.url}`);
    next();
});

// --- 3. PARSOWANIE DANYCH ---
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// --- IMPORTY MIDDLEWARE ---
const verifyToken = require('./middleware/auth');
const checkRole = require('./middleware/roleAuth'); 

//----------------------------------------------
// --- IMPORTY I KONFIGURACJA SWAGGERA ---
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

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
    apis: ['./docs/*.yaml'], 
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
//----------------------------------------------

// --- ŚCIEŻKI REST API ---

app.get('/', (req, res) => {
    res.status(200).json({ message: "API działa poprawnie" });
});

app.post('/register', loginController.handleRegister);
app.post('/login', loginController.handleLogin);

// CRUD Zamówień (Chronione przez verifyToken - trzeba być zalogowanym)
app.get('/orders', verifyToken, orderController.showHistory);            // Historia zamówień
app.get('/orders/:id', verifyToken, orderController.getOrderById);       // Pobieranie do edycji
app.post('/orders', verifyToken, orderController.handleOrder);           // Składanie zamówienia
app.put('/orders/:id', verifyToken, orderController.handleUpdate);       // Aktualizacja 
app.delete('/orders/:id', verifyToken, orderController.deleteOrder);     // Usuwanie

// Wyniki badań (Chronione)
app.get('/results', verifyToken, resultController.showMyResults);                               // Pacjent sprawdza wyniki (GET)
app.post('/results', verifyToken, checkRole('laborant'), resultController.generateResult);      // Laborant dodaje wynik (POST)

app.get('/pricelist/:code', currencyController.getPriceListInCurrency);

// --- URUCHOMIENIE SERWERA ---
app.listen(port, () => {
    console.log(`CenterLab API listening on port ${port}!`)
});


