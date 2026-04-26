const Result = require('../models/resultModel');
const Order = require('../models/orderModel');

const resultController = {
    // 1. Wyświetlenie wszystkich wyników zalogowanego użytkownika
    showMyResults: async (req, res) => {
        try {
            const userId = req.session.userLogin;
            if (!userId) return res.redirect('/login');

            // Pobieramy wszystkie zamówienia użytkownika, żeby wiedzieć, do czego szukać wyników
            const orders = await Order.getAllOrders();
            const userOrders = orders.filter(o => String(o.user_id) === String(userId));

            // Pobieramy wyniki dla tych zamówień
            // W wersji Pro: robimy to jednym zapytaniem SQL z JOIN (ale na razie zróbmy prościej)
            const allResults = [];
            for (const order of userOrders) {
                const results = await Result.getResultsByOrder(order.id);
                if (results.length > 0) {
                    allResults.push(...results);
                }
            }

            res.render('resultsPage', { results: allResults });
        } catch (error) {
            console.error("Błąd pobierania wyników:", error);
            res.status(500).send("Wystąpił błąd podczas ładowania wyników.");
        }
    },

    // 2. Symulacja: Laborant dodaje wynik do zamówienia
    // Ta funkcja mogłaby być wywołana przez specjalny formularz dla pracownika
    generateResult: async (req, res) => {
        try {
            const { orderId, testName, value } = req.body;

            // Używamy profesjonalnej metody saveResult, którą przygotowaliśmy w modelu
            // Ona sama wywoła logikę Julki (getInterpretation) i zapisze do Twojego Neona
            const savedResult = await Result.saveResult(orderId, testName, parseFloat(value));

            console.log(`Wynik wygenerowany i zapisany dla zamówienia nr: ${orderId}`);
            res.status(201).json(savedResult);
        } catch (error) {
            console.error("Błąd generowania wyniku:", error);
            res.status(500).send("Nie udało się wygenerować wyniku.");
        }
    },

    // 3. Widok szczegółowy konkretnego wyniku
    showResultDetails: async (req, res) => {
        try {
            const resultId = req.params.id;
            // Tutaj moglibyśmy pobrać konkretny wiersz z tabeli results
            // i wyświetlić go na osobnej stronie, np. do wydruku jako PDF
            res.send("Widok szczegółowy wyniku w budowie...");
        } catch (error) {
            res.status(404).send("Nie znaleziono wyniku.");
        }
    }
};

module.exports = resultController;