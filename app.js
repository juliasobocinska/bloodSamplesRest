const express = require('express');
const app = express();
const port = 3000;
const zamowienia = require('./controllers/zamowieniaController');

app.set('view engine', 'ejs');

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

app.post('/zamow', zamowienia.odbierzZamowienie);

app.get('/', (req, res) => {
    res.render('index');
});
app.get('/history', zamowienia.showList);
app.get('/delete/:id', zamowienia.deleteOrder);

app.listen(port, () => {
  console.log(`Example app listening on port ${port} - nie zamykaj tego okna!`)
});

