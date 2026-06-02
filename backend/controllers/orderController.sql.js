const Order = require('../models/orderModel.sql');

const orderController = {
    // 1. POBIERANIE HISTORII ZAMÓWIEN (GET)
    showHistory: async (req, res) => {
        try {
            const userId = req.user.id;
            const orders = await Order.getAllOrders(userId);
<<<<<<< HEAD
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
=======
            return res.status(200).json({ status: 200, payload: orders });

        } catch (error) {
            console.error("Błąd ładowania historii:", error);
            return res.status(500).json({ status: 500, payload: "Błąd serwera podczas pobierania historii." });
        }
    },

    handleOrder: async (req, res) => {
        try {
            const { age, quantity_samples, tests, userId } = req.body;
            const owner = userId;

            if (!owner) {
                return res.status(401).send({status:401});
            }
>>>>>>> a4fd96b1e209fbc55928e07f7c40bd4bb2198ead

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
<<<<<<< HEAD
                owner: owner
            };
=======
                owner: owner,
                created_at: new Date()
        };
>>>>>>> a4fd96b1e209fbc55928e07f7c40bd4bb2198ead

            await Order.addToDatabase(newOrderData);
            return res.status(201).json({ message: "Zamówienie zostało utworzone pomyślnie." }); 

<<<<<<< HEAD
=======
            res.status(201).send({status:201, payload: newOrderData});
>>>>>>> a4fd96b1e209fbc55928e07f7c40bd4bb2198ead
        } catch (error) {
            console.error("Błąd składania zamówienia:", error);
            return res.status(500).json({ error: "Błąd serwera podczas składania zamówienia." });
        }
    },

    // 3. USUWANIE ZAMÓWIENIA (DELETE)
    deleteOrder: async (req, res) => {
        try {
            const orderId = req.params.id;
<<<<<<< HEAD
            const currentUserId = req.user.id;

            await Order.deleteFromDatabase(orderId, currentUserId);
            return res.status(200).json({ message: `Zamówienie o ID ${orderId} zostało usunięte.` });

=======
            const currentUserId = req.body.userId || req.query.userId;
            
            if(!currentUserId) {
                res.status(401).send({status:401})
                return
            }

            await Order.deleteFromDatabase(orderId, currentUserId);
            
            res.status(200).send({status: 200});
>>>>>>> a4fd96b1e209fbc55928e07f7c40bd4bb2198ead
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

<<<<<<< HEAD
            if (String(order.user_id) !== String(req.user.id)) {
                return res.status(403).json({ error: "Brak uprawnień do podglądu tego zamówienia." });
            }

            return res.status(200).json({ order: order });
=======
            const currentUserId = req.query.userId || req.body.userId;
            if (String(order.user_id) !== String(currentUserId)) {
    
                return res.status(403).send({status:403});
            }

            const orderDate = new Date(order.created_at || order.date);
            const now = new Date();
            const diffInHours = (now - orderDate) / (1000 * 60 * 60);

        if (diffInHours > 24) {
            return res.status(400).send({
                status: 400, 
                error: "Czas na edycję tego zamówienia (24 godziny) już minął!" 
            });
        }

            res.status(200).send({status: 200, payload: order});
>>>>>>> a4fd96b1e209fbc55928e07f7c40bd4bb2198ead

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
<<<<<<< HEAD
            const uid = req.user.id;
=======
            const uid = req.body.userId; 

            if(!uid) {
                res.status(401).send({status:401})
                return
            }
>>>>>>> a4fd96b1e209fbc55928e07f7c40bd4bb2198ead

            const updateOrder = {
                age: parseInt(age),
                quantity: parseInt(quantity_samples),
                sample_type: Array.isArray(tests) ? tests.join(', ') : tests
            };

            await Order.updateInDatabase(orderId, updateOrder, uid);
            console.log(`Zamówienie ${orderId} zaktualizowane.`);
<<<<<<< HEAD
            return res.status(200).json({ message: "Zamówienie zaktualizowane poprawnie." });

=======
            res.sendStatus(204);
>>>>>>> a4fd96b1e209fbc55928e07f7c40bd4bb2198ead
        } catch (error) {
            console.error("Błąd aktualizacji:", error);
            return res.status(500).json({ error: "Błąd podczas aktualizacji." });

        }
    },

};

module.exports = orderController;