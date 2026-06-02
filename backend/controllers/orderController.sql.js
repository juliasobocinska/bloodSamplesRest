const Order = require('../models/orderModel.sql');

const orderController = {
    // 1. POBIERANIE HISTORII ZAMÓWIEŃ (GET)
    showHistory: async (req, res) => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ error: "Brak autoryzacji. Zaloguj się ponownie." });
            }

            const orders = await Order.getAllOrders(userId);
            return res.status(200).json({ status: 200, payload: orders });

        } catch (error) {
            console.error("Błąd ładowania historii:", error);
            return res.status(500).json({ error: "Błąd serwera podczas pobierania historii." });
        }
    },

    // 2. SKŁADANIE ZAMÓWIENIA (POST)
    handleOrder: async (req, res) => {
        try {
            const owner = req.user?.id;
            const { age, quantity_samples, tests } = req.body;

            if (!owner) {
                return res.status(401).json({ status: 401, error: "Brak autoryzacji. Zaloguj się ponownie." });
            }

            const userOrders = await Order.getAllOrders(parseInt(owner));
            if (userOrders && userOrders.length > 0) {
                const lastOrder = userOrders[0]; 

                const lastOrderDate = new Date(lastOrder.created_at || lastOrder.date);
                const today = new Date();

                // Obliczamy różnicę w miesiącach
                const diffInMonths = (today.getFullYear() - lastOrderDate.getFullYear()) * 12 + (today.getMonth() - lastOrderDate.getMonth());

                if (diffInMonths < 6) {
                    return res.status(400).send({ status: 400, error: 'Możesz złożyć zamówienie na badania maksymalnie raz na pół roku!' });
                }
            }

            const newOrderData = {
                age: parseInt(age) || 0,
                quantity: parseInt(quantity_samples) || 1, 
                tests: Array.isArray(tests) ? tests.join(', ') : (tests || "Brak badań"),
                user_id: owner, // na wypadek kolumny user_id w bazie
                owner: owner,   // na wypadek kolumny owner w bazie
                created_at: new Date()
            };

            await Order.addToDatabase(newOrderData);
            return res.status(201).json({ status: 201, message: "Zamówienie zostało utworzone pomyślnie.", payload: newOrderData }); 

        } catch (error) {
            console.error("Błąd składania zamówienia:", error);
            return res.status(500).json({ error: "Błąd serwera podczas składania zamówienia." });
        }
    },

    // 3. USUWANIE ZAMÓWIENIA (DELETE)
    deleteOrder: async (req, res) => {
        try {
            const orderId = req.params.id;
            // NAPRAWIONE: ID wyciągamy z bezpiecznego tokenu JWT
            const currentUserId = req.user?.id; 
            
            if (!currentUserId) {
                return res.status(401).json({ status: 401, error: "Brak autoryzacji. Zaloguj się ponownie." });
            }

            await Order.deleteFromDatabase(orderId, currentUserId);
            return res.status(200).json({ status: 200, message: "Zamówienie usunięte pomyślnie." });
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

            // NAPRAWIONE: Porównujemy id z tokenu z polem w bazie danych
            const currentUserId = req.user?.id;
            if (String(order.user_id) !== String(currentUserId) && String(order.owner) !== String(currentUserId)) {
                return res.status(403).json({ status: 403, error: "Brak dostępu do tego zamówienia." });
            }

            const orderDate = new Date(order.created_at || order.date);
            const now = new Date();
            const diffInHours = (now - orderDate) / (1000 * 60 * 60);

            if (diffInHours > 24) {
                return res.status(400).json({
                    status: 400, 
                    error: "Czas na edycję tego zamówienia (24 godziny) już minął!" 
                });
            }

            return res.status(200).json({ status: 200, payload: order });

        } catch (error) {
            console.error("Błąd ładowania strony edycji:", error);
            return res.status(500).json({ error: "Błąd serwera." });
        }
    },

    // 5. AKTUALIZACJA ZAMÓWIENIA (PUT)
    handleUpdate: async (req, res) => {
        try {
            const orderId = req.params.id;
            const { age, quantity_samples, tests } = req.body;
            
            // NAPRAWIONE: Wyciągamy ID z tokenu zamiast req.body.userId
            const uid = req.user?.id; 

            if (!uid) {
                return res.status(401).json({ status: 401, error: "Brak autoryzacji." });
            }

            const updateOrder = {
                age: parseInt(age),
                quantity: parseInt(quantity_samples),
                sample_type: Array.isArray(tests) ? tests.join(', ') : tests
            };

            await Order.updateInDatabase(orderId, updateOrder, uid);
            console.log(`Zamówienie ${orderId} zaktualizowane.`);
            return res.status(200).json({ status: 200, message: "Zaktualizowano pomyślnie." });
        } catch (error) {
            console.error("Błąd aktualizacji:", error);
            return res.status(500).json({ error: "Błąd podczas aktualizacji." });
        }
    },
};

module.exports = orderController;