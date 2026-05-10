const Order = require('../models/orderModel.sql');

const orderController = {
    // WYŚWIETLANIE HISTORII - Pobieranie danych z Neona
    showHistory: async (req, res) => {
        try {
            // Pobieramy ID użytkownika z sesji (ustawione przy logowaniu)
            const userId = req.session.userLogin;

            if (!userId) {
                return res.redirect('/login');
            }

            // Czekamy na dane z bazy (await!)
            // Możemy pobrać wszystkie zamówienia lub tylko tego użytkownika
            const orders = await Order.getAllOrders(); 
            
            // Filtrowanie możemy zostawić tutaj lub dopisać metodę w modelu SQL
            const userOrders = orders.filter(o => String(o.user_id) === String(userId));

            res.render('history', { myOrders: userOrders });
        } catch (error) {
            console.error("Błąd ładowania historii:", error);
            res.status(500).send("Błąd serwera przy pobieraniu historii.");
        }
    },

    // SKŁADANIE ZAMÓWIENIA - Zapis do tabeli orders
    handleOrder: async (req, res) => {
        try {
            const { age, quantity_samples, tests } = req.body;
            const owner = req.session.userLogin; // ID zalogowanego użytkownika

            if (!owner) {
                return res.status(401).send("Musisz być zalogowany, aby złożyć zamówienie.");
            }

            const newOrderData = {
                age: parseInt(age) || 0,
                quantity: parseInt(quantity_samples) || 1, 
                tests: Array.isArray(tests) ? tests.join(', ') : (tests || "Brak badań"),
                owner: owner
        };

            // Zapisujemy w SQL (await!)
            await Order.addToDatabase(newOrderData);

            console.log("Zamówienie zapisane w chmurze Neon!");
            res.redirect('/history');
        } catch (error) {
            console.error("Błąd składania zamówienia:", error);
            res.status(500).send("Nie udało się zapisać zamówienia.");
        }
    },

    // USUWANIE ZAMÓWIENIA
    deleteOrder: async (req, res) => {
        try {
            const orderId = req.params.id;
            const currentUserId = req.session.userLogin;
            
            // Wywołujemy Twoją nową metodę SQL
            await Order.deleteFromDatabase(orderId, req.session.userLogin);
            
            res.redirect('/history');
        } catch (error) {
            console.error("Błąd usuwania:", error);
            res.status(500).send("Błąd podczas usuwania zamówienia.");
        }
    },

    // EDYTOWANIE ZAMÓWIENIA
    showEditPage: async (req, res) => {
        try {
            const orderId = req.params.id;
            const order = await Order.findById(orderId);

            if (!order) {
                return res.status(404).send("Nie znaleziono takiego zamówienia.");
            }

            if (String(order.user_id) !== String(req.session.userLogin)) {
                console.log("DEBUG: Brak uprawnień!");
                console.log("ID właściciela (baza):", order.user_id, typeof order.user_id);
                console.log("ID zalogowanego (sesja):", req.session.userLogin, typeof req.session.userLogin);
    
                return res.status(403).send("Nie masz uprawnień do edycji tego zamówienia.");
            }

            res.render('edit', {order: order});

        } catch (error) {
            console.error("Błąd ładowania strony edycji:", error);
            res.status(500).send("Błąd serwera.");
        }
    },

    handleUpdate: async (req, res) => {
        try {
            const orderId = req.params.id;
            const {age, quantity_samples, tests} = req.body;

            const updateOrder = {
                age: parseInt(age),
                quantity: parseInt(quantity_samples),
                sample_type: Array.isArray(tests) ? tests.join(', ') : tests
            };

            await Order.updateInDatabase(orderId, updateOrder);
            console.log(`Zamówienie ${orderId} zaktualizowane.`);
            res.redirect('/history');
        } catch (error) {
            console.error("Błąd aktualizacji:", error);
            res.status(500).send("Błąd podczas zapisywania zmian.");

        }
    },

};

module.exports = orderController;