const OrderModel = require('../models/orderModel'); 
const ResultTests = require('../models/resultModel');

const orderController = {

    //główna funkcja, która odpowiada za skłądanie zamówienia
    handleOrder: (req, res) => {
        try {
        //pobieranie danych przesłanych z formularza
        const amount = Number(req.body.quantity_samples);
        const age = Number(req.body.age);
        const tests = String(req.body.tests || "");

        //pobieranie ID zalogowanego użytkownika z sesji
        const currentUser = req.session.userLogin;

        //sprawdzanie czy użytkownik jest zalogowany
        if(!req.session.userLogin) {
            return res.status(401).send(`
                Musisz się zalogować, aby złożyć zamówienie!
                <a href="/login">ZALOGUJ SIĘ PONOWNIE</a>
                <a href="/">Wróć na stronę główną</a>`);
        }
 
        //Walidacja by sprawdzić poprawność wieku i ilość próbek
        if (amount < 1) {
            return res.status(400).send('Błąd: Nie możesz zamówić 0 próbek!');
        }
        if (age < 18) {
            return res.status(400).send('Pacjent musi być pełnoletni!');
        }

        // Sprawdzanie daty ostatniego zamówienia
        const lastOrder = OrderModel.getLastOrderForUser(currentUser);
        const today = new Date();
        const halfYearAgo = new Date();
        halfYearAgo.setMonth(today.getMonth() - 6);

        if (lastOrder && new Date(lastOrder.date) > halfYearAgo) {
            return res.status(400).render('orderError', { 
            errorMessage: "Niestety, badanie można wykonywać tylko raz na 6 miesięcy." 
        });
        }

        //Generowanie losowego wyniku badań
        const randomValue = Math.floor(Math.random() * 100) + 50;

        const checker = new ResultTests(tests, randomValue)
        const interpretation = checker.getInterpretation();

        //Zapisywanie do bazy. Dodajemy wynik i interpretacje do obiketu zamówienia, żeby były w hsitorii
        const newOrder = new OrderModel(age, amount, tests, today, currentUser);
        
        newOrder.resultValue = randomValue;
        newOrder.interpretation = interpretation;

        OrderModel.addToDatabase(newOrder);

        //wyświetlenie podsumowania po polsku z opcjami powrotu
        res.status(201).send(`
            <h1>Potwierdzenie rejestracji badania</h1>
            <p>Badanie: <strong>${tests}</strong></p>
            <p>Status: Próbka pobrana.</p>
            <hr>
            <div style="background-color: #fff3cd; padding: 15px; border: 1px solid #ffeeba;">
                <strong>Wstępna analiza:</strong>
                <p>${interpretation}</p>
            </div>
            <br>
            <a href="/history">ZOBACZ PEŁNĄ HISTORIĘ</a> | <a href="/">NOWE ZAMÓWIENIE</a>
        `);
    } catch (error) {
        return res.status(500).send("Wystąpił błąd:" + error.message);
    }
    },

    //wyświetlenie listy zamówień należących tylko do zalogowanego użytkownika
    showList: (req, res) => {
        if (!req.session.userLogin) {
            return res.redirect('/login');
        }

        //pobieranie ID użytkownika
        const uid = req.session.userLogin;
        //pobieranie wszystkich rekordów z JSON
        const allOrders = OrderModel.getAllOrders();
        //FILTROWANIE: Zwrócenie tylko tych zamówień, których 'owner' zgadza się z ID sesji
        const onlyMyOrders = allOrders
            .map((order, index) => ({ ...order, originalIndex: index })) 
            .filter(order => order.owner == uid);

        res.render('history', { myOrders: onlyMyOrders });
    },

    //usuwanie zamówień na podstawie indeksu (ID z URL)
    deleteOrder: (req, res) => {
        const id = req.params.id;
        OrderModel.deleteFromDatabase(id);
        res.redirect('/history');  
    },

    //wyświetlenie formmularza edycji z załadowanymi danymi konkretnego zamówienia
    showEditForm: (req, res) => {
        const id = req.params.id;
        const allOrders = OrderModel.getAllOrders();
        const orderToEdit = allOrders[id];

        //walidacja istnienia orderToEdit
        if (!orderToEdit) {
            return res.status(404).send("Nie znaleziono takiego zamówienia.");
        }

        res.render('edit', {order: orderToEdit, id: id});
    },

    // Aktualizacja istniejącego zamówienia
    updateOrder: (req, res) => {
        try {
        const id = req.params.id;
        const amount = Number(req.body.quantity_samples);
        const age = Number(req.body.age);
        const tests = String(req.body.tests || "");

        //walidacja
        if (amount < 1 || age < 18) {
            return res.status(400).send("Błąd: Niepoprawne dane w formularzu edycji.");
        }

        const updateOrder = {
            age: age,
            amount: amount,
            tests: tests,
            owner: req.session.userLogin,
            date: new Date()
        };

        OrderModel.update(id, updateOrder);
        res.redirect("/history");
    } catch (error) {
    return res.status(500).send("Wystąpił błąd:" + error.message);
}
}
}

module.exports = orderController;