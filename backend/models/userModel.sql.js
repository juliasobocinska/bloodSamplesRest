const db = require('./db'); // połączenie z Neonem (baza danych)

class User {
    constructor(id, login, password, full_name) {
        this.id = id;
        this.login = login;
        this.password = password;
        this.full_name = full_name;
    }

    // Pobieranie wszystkich użytkowników z bazy Neon
    static async getAllUsers() {
        try {
            const res = await db.query('SELECT id, email AS login, password, full_name FROM users');
            return res.rows;
        } catch (err) {
            console.error('Błąd getAllUsers:', err);
            return [];
        }
    }

    // Dodanie nowego użytkownika do PostgreSQL
    static async addToDatabase(newObj) {
        try {
            const {full_name, login, password} = newObj;
            const query = `
                INSERT INTO users (full_name, email, password)
                VALUES ($1, $2, $3)
                RETURNING id, email AS login, password, full_name`;

            const res = await db.query(query, [full_name, login, password]);
            console.log('Użytkownik zapisany w chmurze Neon!');
            return res.rows[0];
        } catch (err) {
            console.error('Błąd addToDatabase:', err);
            throw err;
        }
    }

    // Szukanie użytkownika po ID
    static async findUserByID(id) {
        try {
            const res = await db.query('SELECT id, email AS login, password, full_name, role FROM users WHERE id = $1', [id]);
            return res.rows[0] || null;
        } catch (err) {
            return null;
        }
    }

    // Szukanie użytkownika po loginie (u nas kolumna email)
    static async findUserByLogin(login) {
        try {
            const res = await db.query('SELECT id, email AS login, password, full_name, role FROM users WHERE email = $1', [login]);
            return res.rows[0] || null;
        } catch (err) {
            console.error('Błąd (findUserByLogin):', err);
            return null;
        }
    }

}

module.exports = User;