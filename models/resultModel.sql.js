const db = require('./db');

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
        }

        if (this.testName === 'Morfologia') {
            return this.value >= 10 ? 'W normie' : 'Negatywny(Podwyższony)';
        }

        if (this.testName === 'Cholesterol') {
            return this.value < 200 ? 'W normie' : 'Negatywny (Podwyższony)';
        }

        return 'Skonsultuj się z lekarzem.';
    }


    // Zapisanie interpretacji wyniku do bazy danych
    static async saveResult(orderId, testName, value) {
        try {
            const tempResult = new resultTests(null, orderId, testName, value);
            const interpretation = tempResult.getInterpretation();

            // Tworzymy tymczasowy obiekt, żeby skorzystać z "LOGIKI"
            const query = `
            INSERT INTO results (order_id, description)
            VALUES ($1, $2)
            RETURNING *`
        } catch (err) {
            
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
}

module.exports = resultTests;