const Order = require('../models/orderModel.sql');

const orderController = {
    // WYŚWIETLANIE HISTORII - Pobieranie danych z Neona
    showHistory: async (req, res) => {
        try {
            const userId = req.query.userId || req.body.userId;

            if (!userId) {
                return res.status(401).send({status:401});
            }
            const orders = await Order.getAllOrders(parseInt(userId)); 

            res.send({ status: 200, payload: orders});
        } catch (error) {
            console.error("Błąd ładowania historii:", error);
            res.status(500).send({status:500});
        }
    },

    handleOrder: async (req, res) => {
        try {
            const { age, quantity_samples, tests, userId } = req.body;
            const owner = userId;

            if (!owner) {
                return res.status(401).send({status:401});
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
                owner: owner,
                created_at: new Date()
        };

            // Zapisujemy w SQL
            await Order.addToDatabase(newOrderData);

            res.status(201).send({status:201, payload: newOrderData});
        } catch (error) {
            console.error("Błąd składania zamówienia:", error);
            res.status(500).send({status:500});
        }
    },

    // USUWANIE ZAMÓWIENIA
    deleteOrder: async (req, res) => {
        try {
            const orderId = req.params.id;
            const currentUserId = req.body.userId || req.query.userId;
            
            if(!currentUserId) {
                res.status(401).send({status:401})
                return
            }

            await Order.deleteFromDatabase(orderId, currentUserId);
            
            res.status(200).send({status: 200});
        } catch (error) {
            console.error("Błąd usuwania:", error);
            res.status(500).send({status:500});
        }
    },

    // EDYTOWANIE ZAMÓWIENIA
    showEditPage: async (req, res) => {
        try {
            const orderId = req.params.id;
            const order = await Order.findById(orderId);

            if (!order) {
                return res.status(404).send({status:404});
            }

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

        } catch (error) {
            console.error("Błąd ładowania strony edycji:", error);
            res.status(500).send({status:500});
        }
    },

    handleUpdate: async (req, res) => {
        try {
            const orderId = req.params.id;
            const {age, quantity_samples, tests} = req.body;
            const uid = req.body.userId; 

            if(!uid) {
                res.status(401).send({status:401})
                return
            }

            const updateOrder = {
                age: parseInt(age),
                quantity: parseInt(quantity_samples),
                sample_type: Array.isArray(tests) ? tests.join(', ') : tests
            };

            await Order.updateInDatabase(orderId, updateOrder, uid);
            console.log(`Zamówienie ${orderId} zaktualizowane.`);
            res.sendStatus(204);
        } catch (error) {
            console.error("Błąd aktualizacji:", error);
            res.status(500).send({status:500});

        }
    },

};

module.exports = orderController;