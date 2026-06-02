const Result = require('../models/resultModel.sql.js');
const { sendResultEmail } = require('../services/emailService.js');

const resultController = {

    // 1. Pobieranie wyników dla pacjenta (GET)
    showMyResults: async (req, res) => {
        try {
            const userId = req.user.id;

            const userResults = await Result.getAllForUser(userId);
            return res.status(200).json({ payload: userResults });;

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

            // --- SEKCJA WYSYŁANIA E-MAILA ---
            const testEmail = "sebastian.szew2@gmail.com"; 
            
            const tempResult = new Result(null, orderId, testName, parseFloat(value));
            const interpretation = tempResult.getInterpretation();
            
            await sendResultEmail(testEmail, testName, interpretation);
            // -------------------------------------

            const newResultData = {
                orderId: orderId,
                testName: testName,
                value: parseFloat(value),
                createdAt: new Date()
            };

            console.log(`Zapisano nowy wynik dla zamówienia nr ${orderId}`);
            res.status(201).send({status:201, payload: newResultData});

        } catch (error) {
            console.error("Błąd zapisywania wyniku:", error);
            return res.status(500).json({ error: "Nie udało się zapisać wyniku." });
        }
    }
}

module.exports = resultController;