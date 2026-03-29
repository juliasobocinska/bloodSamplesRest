const fs = require('node:fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'orders.json');

const dataBaseOrder = [];

class Order {
    constructor(age, quantity, tests, data) {
        this.age = age;
        this.quantity = quantity;
        this.tests = tests;
        this.data = data;
    }

    static addToDatabase(newObj) {
        const currentData = this.getAllOrders();
        currentData.push(newObj);
        fs.writeFileSync(filePath, JSON.stringify(currentData, null, 2)); 
        console.log('Database updated! Current orders:', currentData);
    }

    static getLastOrder() {
        return dataBaseOrder[dataBaseOrder.length - 1];
    }

    static getAllOrders() {
        try {
            if (!fs.existsSync(p)) return [];

            const filesData = fs.readFileSync(p, 'utf8');
            return filesData ? JSON.parse(filesData) : [];
        } catch (err) {

        return [];
    }
}

    static deleteFromBase(id) {
        const actualList = this.getAllOrders();
        const newList = actualList.filter((item, index) => index != id);
        fs.writeFileSync(p, JSON.stringify(newList));
    }

    static update(id, updateOrder) {
        const orders = this.getAll();

        if (orders[id]) {
            orders[id] = updateOrder;

            fs.writeFileSync(filePath, JSON.stringify(orders, null, 2));
            console.log(`Order number ${id} has been updated!`);
        } else {
            console.log(`Cannot find order with this id.`);
        }
    }
}

module.exports = Order;