const Order = require('../models/orderModel.sql');

const orderController = {
    // 1. POBIERANIE HISTORII ZAMÓWIEN (GET)
    showHistory: async (req, res) => {
        try {
            const userId = req.user.id;
            const orders = await Order.getAllOrders(userId);
            return res.status(200).json({ orders: orders });

        } catch (error) {
            console.error("Błąd ładowania historii:", error);
            return res.status(500).json({ error: "Błąd serwera podczas pobierania historii." });
        }
    },

    // 2. SKŁADANIE ZAMÓWIENIA (POST)
    handleOrder: async (req, res) => {
        try {
            const { age, quantity_samples, tests } = req.body;
            const owner = req.user.id;

            const newOrderData = {
                age: parseInt(age) || 0,
                quantity: parseInt(quantity_samples) || 1, 
                tests: Array.isArray(tests) ? tests.join(', ') : (tests || "Brak badań"),
                owner: owner
            };

            await Order.addToDatabase(newOrderData);
            return res.status(201).json({ message: "Zamówienie zostało utworzone pomyślnie." }); 

        } catch (error) {
            console.error("Błąd składania zamówienia:", error);
            return res.status(500).json({ error: "Błąd serwera podczas składania zamówienia." });
        }
    },

    // 3. USUWANIE ZAMÓWIENIA (DELETE)
    deleteOrder: async (req, res) => {
        try {
            const orderId = req.params.id;
            const currentUserId = req.user.id;

            await Order.deleteFromDatabase(orderId, currentUserId);
            return res.status(200).json({ message: `Zamówienie o ID ${orderId} zostało usunięte.` });

        } catch (error) {
            console.error("Błąd usuwania:", error);
            return res.status(500).json({ error: "Błąd serwera podczas usuwania zamówienia." });
        }
    },

    // 4. POBIERANIE DANYCH ZAMÓWIENIA DO EDYCJI (GET)
    getOrderById: async (req, res) => {
        try {
            const orderId = req.params.id;
            const order = await Order.findById(orderId);

            if (!order) {
                return res.status(404).json({ error: "Nie znaleziono zamówienia." });
            }

            if (String(order.user_id) !== String(req.user.id)) {
                return res.status(403).json({ error: "Brak uprawnień do podglądu tego zamówienia." });
            }

            return res.status(200).json({ order: order });

        } catch (error) {
            console.error("Błąd ładowania strony edycji:", error);
            return res.status(500).json({ error: "Błąd serwera." });
        }
    },

    // 5. AKTUALIZACJA ZAMÓWIENIA (PUT)
    handleUpdate: async (req, res) => {
        try {
            const orderId = req.params.id;
            const {age, quantity_samples, tests} = req.body;
            const uid = req.user.id;

            const updateOrder = {
                age: parseInt(age),
                quantity: parseInt(quantity_samples),
                sample_type: Array.isArray(tests) ? tests.join(', ') : tests
            };

            await Order.updateInDatabase(orderId, updateOrder, uid);
            console.log(`Zamówienie ${orderId} zaktualizowane.`);
            return res.status(200).json({ message: "Zamówienie zaktualizowane poprawnie." });

        } catch (error) {
            console.error("Błąd aktualizacji:", error);
            return res.status(500).json({ error: "Błąd podczas aktualizacji." });

        }
    },

};

module.exports = orderController;