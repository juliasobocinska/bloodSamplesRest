const { Pool } = require('pg');
require('dotenv').config(); // To ładuje Twoje dane z pliku .env

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
    rejectUnauthorized: false // Wymagane, aby połączyć się bezpiecznie z Neonem
    }
});

// Prosty test połączenia przy starcie
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
    console.error('Błąd połączenia z bazą Neon:', err.stack);
    } else {
    console.log('Połączono z bazą danych! Czas serwera:', res.rows[0].now);
    }
});

module.exports = pool;