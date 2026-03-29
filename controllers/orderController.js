const OrderModel = require('../models/orderModel'); 

const orderController = {
    handleOrder: (req, res) => {
        const amount = req.body.quantity_samples;
        const age = req.body.age;
        const tests = req.body.tests;

        // Walidacja podstawowa
        if (amount < 1) {
            return res.status(400).send('Błąd: Nie możesz zamówić 0 próbek!');
        }
        if (age < 18) {
            return res.status(400).send('Pacjent musi być pełnoletni!');
        }

        // Sprawdzanie daty ostatniego zamówienia
        const lastOrder = OrderModel.getLastOrder();
        const today = new Date();
        const halfYearAgo = new Date();
        halfYearAgo.setMonth(today.getMonth() - 6);

        if (lastOrder && new Date(lastOrder.date) > halfYearAgo) {
            return res.status(400).send('Zamówienie może być robione raz na pół roku!');
        }

        // Tworzenie i zapisywanie nowego obiektu
        const newOrder = new OrderModel(age, amount, tests, today);
        OrderModel.addToDatabase(newOrder);

        res.status(201).send(`Sukces! Zamówiono ${amount} próbek! Dane zostały zapisane.`);
    },

    showList: (req, res) => {
        const orders = OrderModel.getAllOrders();
        res.render('history', { myOrders: orders });
    },

    deleteOrder: (req, res) => {
        const id = req.params.id;
        OrderModel.deleteFromDatabase(id);
        res.redirect('/history'); // Zmieniłam na przekierowanie do historii, żeby widzieć efekt usunięcia
    },

    showEditForm: (req, res) => {
        const id = req.params.id;
        const allOrders = OrderModel.getAllOrders();
        const orderToEdit = allOrders[id];

        res.render('edit', {order: orderToEdit, id: id});
    },

    updateOrder: (req, res) => {
        const id = req.params.id;

        const amount = req.body.quantity_samples;
        const age = req.body.age;
        const tests = req.body.tests;

        const updateOrder = {
            age: age,
            amount: amount,
            tests: tests,
            date: new Date()
        };

        OrderModel.update(id, updateOrder);
        res.redirect("/history");
    }
};

module.exports = orderController;