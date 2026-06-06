const db = require('./db'); // połączenie z Neonem (baza danych)

class Payment {
    constructor(id, order_id, payu_id, price, description, status) {
        this.id = id;
        this.order_id = order_id;
        this.payu_id = payu_id;
        this.price = price;
        this.description = description;
        this.status = status;
    }

    // Dodanie płatności do bazy
    static async addToDatabase(newObj) {
        try {
            const { order_id, payu_id, price, description, status } = newObj;
            const query = `
            INSERT INTO payments (order_id, payu_id, price, description, status)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`;

            const res = await db.query(query, [order_id, payu_id, price, description, status]);
            return res.rows[0];
        } catch (err) {
            console.error('Błąd addToDatabase (Payment):', err);
            throw err;
        }
    }

    // Znajdź płatność po ID
    static async findById(id) {
        try {
            const res = await db.query('SELECT * FROM payments WHERE id = $1', [id]);
            return res.rows[0] || null;
        } catch (err) {
            console.error('Błąd findById (Payment):', err);
            throw err;
        }
    }

    // Pobierz wszystkie płatności powiązane z danym zamówieniem
    static async getByOrderId(orderId) {
        try {
            const res = await db.query('SELECT * FROM payments WHERE order_id = $1 ORDER BY id DESC', [orderId]);
            return res.rows;
        } catch (err) {
            console.error('Błąd getByOrderId (Payment):', err);
            return [];
        }
    }

    // Pobierz wszystkie płatności lub tylko dla konkretnego użytkownika (przez join na orders)
    static async getAllPayments(userId = null) {
        try {
            if (userId) {
                const query = `
                    SELECT p.*
                    FROM payments p
                    JOIN orders o ON p.order_id = o.id
                    WHERE o.user_id = $1
                    ORDER BY p.id DESC
                `;
                const { rows } = await db.query(query, [userId]);
                return rows;
            } else {
                const res = await db.query('SELECT * FROM payments ORDER BY id DESC');
                return res.rows;
            }
        } catch (err) {
            console.error('Błąd getAllPayments (Payment):', err);
            return [];
        }
    }
}

module.exports = Payment;
