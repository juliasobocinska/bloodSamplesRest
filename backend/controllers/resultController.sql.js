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
            const Order = require('../models/orderModel.sql');
            const patientEmail = await Order.getPatientEmailByOrderId(orderId);

            if (patientEmail) {
                console.log(`Wykryto adres e-mail pacjenta: ${patientEmail}. Uruchamiam wysyłkę...`);
                
                const tempResult = new Result(null, orderId, testName, parseFloat(value));
                const interpretation = tempResult.getInterpretation();
                
                try {
                    await sendResultEmail(patientEmail, testName, interpretation);
                } catch (mailError) {
                    console.error("Resend zablokował wysyłkę (prawdopodobnie adres nie jest w darmowym Sandboxie):", mailError.message);
                }
            } else {
                console.log(`Zamówienie nr ${orderId} nie ma przypisanego adresu e-mail w systemie. Pomijam wysyłkę.`);
            }
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