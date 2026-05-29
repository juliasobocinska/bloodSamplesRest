const db = require('./db'); // połączenie z Neonem (baza danych)

class resultTests {
    constructor(id, order_id, testName, value, description) {
        this.id = id;
        this.order_id = order_id;
        this.testName = testName;
        this.value = value;
        this.description = description;
    }

    //zwraca interpretacje wybranego badania na podstawie norm medycznych (póżniej dodam dokładniejsze normy) "LOGIKA"
        getInterpretation() {
        if (this.testName === "Glukoza") {
            if (this.value < 70) return 'Pozytywny';
            if (this.value > 99) return 'Negatywny, skonsultuj się z lekarzem.';
            return 'W normie';
        }

        if (this.testName === 'Morfologia') {
            return this.value >= 10 ? 'W normie' : 'Negatywny(Podwyższony)';
        }

        if (this.testName === 'Cholesterol') {
            return this.value < 200 ? 'W normie' : 'Negatywny (Podwyższony)';
        }

        return 'Skonsultuj się z lekarzem.';
    }


    // Zapisanie wyniku do bazy danych (poprawione SQL)
    static async saveResult(orderId, testName, value) {
        try {
            const tempResult = new resultTests(null, orderId, testName, value);
            const interpretation = tempResult.getInterpretation();

            // Tworzymy tymczasowy obiekt, żeby skorzystać z "LOGIKI"
            const query = `
            INSERT INTO results (order_id, test_name, test_value, description)
                VALUES ($1, $2, $3, $4)
                RETURNING *
            `;
            const { rows } = await db.query(query, [orderId, testName, value, interpretation]);
            return rows[0];
        } catch (err) {
            console.error('Błąd zapisywania wyniku (saveResult):', err);
            throw err;
        }
    }

    // Pobranie wyników dla konkretnego 
    static async getResultsByOrder(orderId) {
        try {
            const res = await db.query('SELECT * FROM results WHERE order_id = $1', [orderId]);
            return res.rows;
        } catch (err) {
            return [];
        }
    }

    static async getAllForUser(userId) {
        try {
            const query = `
                SELECT r.*, o.sample_type
                FROM results r
                JOIN orders o ON r.order_id = o.id
                WHERE o.user_id = $1
                ORDER BY r.uploaded_at DESC
            `;
            const { rows } = await db.query(query, [userId]);
            return rows;
        } catch (err) {
            console.error('Błąd getAllForUser:', err);
            throw err;
        }
    }
}

module.exports = resultTests;