const db = require('./db'); // połączenie z Neonem (baza danych)

class Order {
    constructor(age, quantity, tests, date, owner) {
        this.age = age;
        this.quantity = quantity;
        this.tests = tests;
        this.date = date;
        this.owner = owner;
    }

    // Pobieranie wszystkich zamówień z bazy
    static async getAllOrders (userId = null) {
        try {
            let query = '';
            let params = [];

            if (userId) {
                // Jeśli podano ID, szukamy zamówień tylko tego użytkownika
                query = 'SELECT * FROM orders WHERE user_id = $1 ORDER BY order_date DESC';
                params = [userId];
            } else {
                // W przeciwnym razie pobieramy wszystko (np. dla panelu admina)
                query = 'SELECT * FROM orders ORDER BY order_date DESC';
            }

            const res = await db.query(query, params);
            return res.rows;
        } catch (err) {
            console.error('Błąd getAllOrders:', err);
            return [];
        }
    }

    // Dodawanie zamówienia do PostgreSQL
    static async addToDatabase (newObj) {
        try {
            const {age, quantity, tests, owner} = newObj;
            const query = `
            INSERT INTO orders (age, quantity, sample_type, user_id)
            VALUES ($1,$2, $3, $4)
            RETURNING *`;

            const res = await db.query(query, [age, quantity, tests, owner]);
            return res.rows[0];
        } catch (err) {
            console.error('Błąd addToDatabase:', err);
            throw err;
        }
    }
    // Pobieranie ostatniego zamówienia dla konkretnego użytkownika
    static async getLastOrderForUser (userId) {
        try {
            const query = `
            SELECT * FROM orders
            WHERE user_id = $1
            ORDER BY order_date DESC
            LIMIT 1`;

            const res = await db.query(query, [userId]);
            return res.rows[0] || null;
        } catch (err) {
            return null;
        }
    }

    // Usuwanie zamówienia po ID z bazy
    static async deleteFromDatabase (id, userId) {
        try {
            await db.query('DELETE FROM orders WHERE id = $1 AND user_id = $2', [id, userId]);
            console.log(`Order ${id} deleted from Neon.`);
        } catch (err) {
            console.error('Błąd deleteFromDatabase:', err);
            throw err;
        }
    }

    // Edytowanie zamówienia 
    static async findById(id) {
        try {
            const query = 'SELECT * FROM orders WHERE id = $1';
            const res = await db.query(query, [id]);
            return res.rows[0];
        } catch (err) {
            console.error('Błąd findById', err);
            throw err;
        }
    }

    // Zapisywanie zmian zamówienia
    static async updateInDatabase(id, updatedData, uid) {
        try {
            const {age, quantity, sample_type} = updatedData;
            const query = `
            UPDATE orders
            SET age = $1, quantity = $2, sample_type = $3
            WHERE id = $4 and user_id = $5`;
            await db.query(query, [age, quantity, sample_type, id, uid]);
            return true;
        } catch (err) {
            console.error('Błąd updateInDatabase:', err);
            throw err;
        }
    }

    // Pobieranie adresu e-mail pacjenta na podstawie ID zamówienia
    static async getPatientEmailByOrderId(orderId) {
        try {
            const query = `
                SELECT u.email 
                FROM orders o
                JOIN users u ON o.user_id = u.id
                WHERE o.id = $1
            `;
            const res = await db.query(query, [orderId]);
            return res.rows[0] ? res.rows[0].email : null;
        } catch (err) {
            console.error('Błąd getPatientEmailByOrderId:', err);
            return null;
        }
    }
}

module.exports = Order;