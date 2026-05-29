const Order = require('../models/orderModel.sql');

const orderController = {
    // WYŚWIETLANIE HISTORII - Pobieranie danych z Neona
    showHistory: async (req, res) => {
        try {
            // Pobieramy ID użytkownika z sesji (ustawione przy logowaniu)
            const userId = req.session.userLogin;

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

    // SKŁADANIE ZAMÓWIENIA - Zapis do tabeli orders
    handleOrder: async (req, res) => {
        try {
            const { age, quantity_samples, tests } = req.body;
            const owner = req.session.userLogin; // ID zalogowanego użytkownika

            if (!owner) {
                return res.status(401).send({status:401});
            }

            const newOrderData = {
                age: parseInt(age) || 0,
                quantity: parseInt(quantity_samples) || 1, 
                tests: Array.isArray(tests) ? tests.join(', ') : (tests || "Brak badań"),
                owner: owner
        };

            // Zapisujemy w SQL
            await Order.addToDatabase(newOrderData);

            res.status(201).send({status:201});
        } catch (error) {
            console.error("Błąd składania zamówienia:", error);
            res.status(500).send({status:500});
        }
    },

    // USUWANIE ZAMÓWIENIA
    deleteOrder: async (req, res) => {
        try {
            const orderId = req.params.id;
            const currentUserId = req.session.userLogin;
            
            if(!currentUserId) {
                res.status(401).send({status:401})
                return
            }

            await Order.deleteFromDatabase(orderId, currentUserId);
            
            res.redirect('/history');
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

            if (String(order.user_id) !== String(req.session.userLogin)) {
    
                return res.status(403).send({status:403});
            }

            res.render('edit', {order: order, loggedIn: true});

        } catch (error) {
            console.error("Błąd ładowania strony edycji:", error);
            res.status(500).send({status:500});
        }
    },

    handleUpdate: async (req, res) => {
        try {
            const orderId = req.params.id;
            const {age, quantity_samples, tests} = req.body;
            const uid = req.session.userLogin

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
            res.status(204).send(204);
        } catch (error) {
            console.error("Błąd aktualizacji:", error);
            res.status(500).send({status:500});

        }
    },

};

module.exports = orderController;