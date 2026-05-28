const Result = require('../models/resultModel.sql.js');
const Order = require('../models/orderModel.sql.js');

const resultController = {

    // 1. Wyświetlenie wyników dla zalogowanego pacjenta
    showMyResults: async (req, res) => {
        try {
            const userId = req.session.userLogin;

            if (!userId) {
                return res.status(401).send("Musisz być zalogowany, aby zobaczyć wyniki.");
            }
            const userResults = await Result.getAllForUser(userId);

            res.render('resultsPage', { results: userResults, loggedIn: true });
        } catch (error) {
            console.error("Błąd pobierania wyników:", error);
            res.status(500).send("Wystąpił błąd podczas ładowania wyników.");
        }
    },

    // 2. Laborant dodaje wynik (np. przez formularz)
    generateResult: async (req, res) => {
        try {
            const {orderId, testName, value} = req.body;

            await Result.saveResult(orderId, testName, parseFloat(value));

            console.log(`Zapisano nowy wynik dla zamówienia nr ${orderId}`);
            res.redirect('/results');

        } catch (error) {
            console.error("Błąd zapisywania wyniku:", error);
            res.status(500).send("Nie udało się zapisać wyniku.");
        }
    }
}

module.exports = resultController;