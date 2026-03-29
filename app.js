const express = require('express');
const app = express();
const port = 3000;
const orderController = require('./controllers/orderController');
const loginController = require('./controllers/loginController');

app.set('view engine', 'ejs');

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

app.post('/order', orderController.handleOrder);


app.get('/', (req, res) => {
    res.render('index');
});

app.get('/login', loginController.showLoginPage);
app.post('/login', loginController.login);

app.get('/history', orderController.showList);
app.get('/delete/:id', orderController.deleteOrder);

app.get('/edit/:id', orderController.showEditForm);
app.post('/update/:id', orderController.updateOrder);

app.listen(port, () => {
  console.log(`Example app listening on port ${port} - nie zamykaj tego okna!`)
});

