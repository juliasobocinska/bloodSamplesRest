const Result = require('../models/resultModel.sql.js');
const Order = require('../models/orderModel.sql.js');

const resultController = {

    // 1. Wyświetlenie wyników dla zalogowanego pacjenta
    showMyResults: async (req, res) => {
        try {
            const userId = req.query.userId;

            if (!userId) {
                return res.status(401).send({status:401});
            }
            const userResults = await Result.getAllForUser(userId);

            res.send({status:200, payload: userResults });
        } catch (error) {
            console.error("Błąd pobierania wyników:", error);
            res.status(500).send({status:500});
        }
    },

    // 2. Laborant dodaje wynik (np. przez formularz)
    generateResult: async (req, res) => {
        try {
            const {orderId, testName, value} = req.body;

            await Result.saveResult(orderId, testName, parseFloat(value));

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
            res.status(500).send({status:500});
        }
    }
}

module.exports = resultController;