const fs = require('node:fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'users.json');

class User {
    constructor(id, login, password) {
        this.id = id;
        this.login = login;
        this.password = password;
    }

    static getAllUsers() {
        try {
            if (!fs.existsSync(filePath)) return [];

            const filesData = fs.readFileSync(filePath, 'utf8');
            return filesData ? JSON.parse(filesData) : [];
        } catch (err) {
            return [];
        }
    }

    static addToDatabase(newObj) {
        const currentData = this.getAllUsers();
        currentData.push(newObj);
        fs.writeFileSync(filePath, JSON.stringify(currentData, null, 2)); 
        console.log('Database updated! Current users:', currentData);
    }

    static findUserByID(id) {
        const currentData = this.getAllUsers();
        
        for (const user of currentData) {
            if (user.id === id) {
                return user;
            }
        }
        return null;
    }

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