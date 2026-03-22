const zamowienieModel = require('../models/zamowienieModel');

const zamowieniaContorller = {
    odbierzZamowienie: (req, res) => {
        const ilosc = req.body.ilosc_probek;
        const wiek = req.body.wiek;
        const badania = req.body.badania;

        if (ilosc < 1) {
            return res.status(400).send('Błąd: Nie możesz zamówić 0 próbek!');
        }
        if (wiek < 18) {
            return res.status(400).send('Pacjent musi być pełnoletni!');
        }

        const ostatnieZamowienie = zamowienieModel.wyciagnijOstatnieZamowienie();
        const today = new Date();
        const halfAYearAgo = new Date();
        halfAYearAgo.setMonth(today.getMonth() - 6);

         if (ostatnieZamowienie && ostatnieZamowienie.data > halfAYearAgo ) {
            return res.status(400).send('Zamowijenie moze byc robione raz na pół roku!');
         }

        const nowe = new zamowienieModel(wiek, ilosc, badania, today);

        zamowienieModel.dodajDoBazy(nowe);

        res.status(201).send(`Sukces! Zamówiłeś ${ilosc} próbek! Oraz dane zapisane!`);
    },

    showList: (req, res) => {
        const dataFromFile = zamowienieModel.pobierzWszystkie();
        res.render('history', {myOrder: dataFromFile});
    },

    deleteOrder: (req, res) => {
        const id = req.params.id;
        zamowienieModel.deleteFromBase(id);
        res.redirect('/');
    }
};

module.exports = zamowieniaContorller;