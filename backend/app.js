// --- IMPORTY MODUŁÓW ---
const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;
const orderController = require('./controllers/orderController.sql.js'); 
const loginController = require('./controllers/loginController.sql.js'); 
const resultController = require('./controllers/resultController.sql.js'); 
const currencyController = require('./controllers/currencyController.js');
const session = require('express-session');
require('./models/db');

// --- 1. GLOBALNA KONFIGURACJA CORS (Zawsze na samej górze!) ---
app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// --- 2. LOGGER DO TESTÓW (Powie nam w terminalu o każdym ruchu!) ---
app.use((req, res, next) => {
    console.log(`[ŻĄDANIE] Metoda: ${req.method} | Ścieżka: ${req.url}`);
    next();
});

// --- 3. PARSOWANIE DANYCH ---
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// --- 4. IMPORTY MIDDLEWARE AUTORYZACJI ---
const verifyToken = require('./middleware/auth');

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

// CRUD Zamówień
app.post('/orders', verifyToken, orderController.handleOrder);           
app.get('/orders', verifyToken, orderController.showHistory);            
app.get('/orders/:id', verifyToken, orderController.getOrderById);       
app.put('/orders/:id', verifyToken, orderController.handleUpdate);       
app.delete('/orders/:id', verifyToken, orderController.deleteOrder);     

// Wyniki badań
app.get('/results', verifyToken, resultController.showMyResults);        
app.post('/results', verifyToken, resultController.generateResult);      

app.get('/pricelist/:code', currencyController.getPriceListInCurrency);

// --- URUCHOMIENIE SERWERA ---
app.listen(port, () => {
  console.log(`CenterLab API listening on port ${port}!`)
});