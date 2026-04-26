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
    static async getAllOrders () {
        try {
            const res = await db.query('SELECT * FROM orders ORDER BY order_date DESC');
            return res.rows;
        }catch (err) {
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
            return res.rows || null;
        } catch (err) {
            return null;
        }
    }

    // Usuwanie zamówienia po ID z bazy
    static async deleteFromDatabase (id) {
        try {
            await db.query(' DELETE FROM orders WHERE id = $1', [id]);
            console.log(`Order ${id} deleted from Neon.`);
        } catch (err) {
            console.error('Błąd deleteFromDatabase:', err);
        }
    }

}

module.exports = Order;