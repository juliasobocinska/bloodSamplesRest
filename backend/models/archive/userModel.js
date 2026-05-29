const fs = require('node:fs');
const path = require('path');
//// ścieżka do pliku JSON, gdzie przechowujemy konta użytkowników
const filePath = path.join(__dirname, '..', 'users.json');

class User {
    constructor(id, login, password) {
        this.id = id;
        this.login = login;
        this.password = password;
    }

    //pobiera wszystkich użytkowników z pliku
    static getAllUsers() {
        try {
            if (!fs.existsSync(filePath)) return [];

            const filesData = fs.readFileSync(filePath, 'utf8');
            return filesData ? JSON.parse(filesData) : [];
        } catch (err) {
            return [];
        }
    }

    //dodaje nowego użytkownika do pliku JSON
    static addToDatabase(newObj) {
        const currentData = this.getAllUsers();
        currentData.push(newObj);

        fs.writeFileSync(filePath, JSON.stringify(currentData, null, 2)); 
        console.log('Database updated! Current users:', currentData);
    }

    //sprawdza czy użytkownik o danym ID istnieje
    static findUserByID(id) {
        const currentData = this.getAllUsers();
        
        for (const user of currentData) {
            if (user.id === id) {
                return user;
            }
        }
        return null;
    }

    //sprawdza czy użytkownik o danym loginie istnieje
    static findUserByLogin(login) {
        const currentData = this.getAllUsers();

        for (const user of currentData) {
            if (user.login === login) {
                return user;
            }
        }
        return null;
    }
}

module.exports = User;