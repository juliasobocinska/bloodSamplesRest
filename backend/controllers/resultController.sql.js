const Result = require('../models/resultModel.sql.js');

const resultController = {

    // 1. Pobieranie wyników dla pacjenta (GET)
    showMyResults: async (req, res) => {
        try {
            const userId = req.user.id;

            const userResults = await Result.getAllForUser(userId);
            return res.status(200).json({ results: userResults });

        } catch (error) {
            console.error("Błąd pobierania wyników:", error);
            return res.status(500).json({ error: "Błąd pobierania wyników." });
        }
    },

    // 2. Dodawanie wyniku przez laboranta (POST)
    generateResult: async (req, res) => {
        try {
            const {orderId, testName, value} = req.body;

            await Result.saveResult(orderId, testName, parseFloat(value));
            console.log(`Zapisano nowy wynik dla zamówienia nr ${orderId}`);

            return res.status(201).json({ message: `Zapisano nowy wynik dla zamówienia nr ${orderId}` });

        } catch (error) {
            console.error("Błąd zapisywania wyniku:", error);
            return res.status(500).json({ error: "Nie udało się zapisać wyniku." });
        }
    }
}

module.exports = resultController;