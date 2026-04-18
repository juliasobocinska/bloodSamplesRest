const fs = require('node:fs');
const path = require('path');
// Ścieżka do pliku JSON, w którym przechowujemy wszystkie złożone zamówienia
const filePath = path.join(__dirname, '..', 'orders.json');

const dataBaseOrder = [];

class Order {
    constructor(age, quantity, tests, date, owner) {
        this.age = age;
        this.quantity = quantity;
        this.tests = tests;
        this.date = date;
        this.owner = owner;
    }

    //pobieranie obecnych danych, dodanie nowego obiektu i zapisanie całości do pliku
    static addToDatabase(newObj) {
        const currentData = this.getAllOrders();
        currentData.push(newObj);

        fs.writeFileSync(filePath, JSON.stringify(currentData, null, 2)); 
        console.log('Database updated! Current orders:', currentData);
    }

    // Pobieranie ostatniego zamówienia - wersja poprawiona
    static getLastOrderForUser(owner) {
        const allOrders = this.getAllOrders();
        // Zamieniamy oba ID na String, żeby mieć pewność, że porównujemy tekst z tekstem
        const userOrders = allOrders.filter((order) => String(order.owner) === String(owner)); 
        
        if (userOrders.length === 0) return null;
        
        // Zwracamy ostatni element z przefiltrowanej listy
        return userOrders[userOrders.length - 1];
    }

    //odczytanie wszystkich elementów
    static getAllOrders() {
        try {
            if (!fs.existsSync(filePath)) return [];

            const filesData = fs.readFileSync(filePath, 'utf8');
            return filesData ? JSON.parse(filesData) : [];
        } catch (err) {

        return [];
    }
}

    //usuwanie, filtruje listę tak, aby wyrzucić element o danym indeksie
    static deleteFromDatabase(id) {
        const actualList = this.getAllOrders();
        const newList = actualList.filter((item, index) => index != id);

        fs.writeFileSync(filePath, JSON.stringify(newList));
    }

    //aktualizacja, znjadowanie zamówienia po indeksie i podmienia jego dane
    static update(id, updateOrder) {
        const orders = this.getAllOrders();

        //sprawdzamy czy zamóienie o takim numerze w ogóle istnieje
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