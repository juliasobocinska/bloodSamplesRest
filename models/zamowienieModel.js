const fs = require('node:fs');
const path = require('path');

const p = path.join(__dirname, '..', 'zamowienia.json');

const bazaZamowien = [];

class zamowienia {
    constructor(wiek, ilosc, badanie, data) {
        this.wiek = wiek;
        this.ilosc = ilosc;
        this.badanie = badanie;
        this.data = data;
    }

    static dodajDoBazy(nowyObj) {
        const aktualnaBaza = this.pobierzWszystkie();
        aktualnaBaza.push(nowyObj);
        fs.writeFileSync(p, JSON.stringify(aktualnaBaza));
        console.log('Baza zaktualizowana! Obecna baza:', aktualnaBaza);
    }

    static wyciagnijOstatnieZamowienie() {
        return bazaZamowien[bazaZamowien.length - 1];
    }

    static pobierzWszystkie() {
        try {
            if (!fs.existsSync(p)) return [];

            const filesData = fs.readFileSync(p, 'utf8');
            return filesData ? JSON.parse(filesData) : [];
        } catch (err) {

        return [];
    }
}

    static deleteFromBase(id) {
        const actualList = this.pobierzWszystkie();
        const newList = actualList.filter((item, index) => index != id);
        fs.writeFileSync(p, JSON.stringify(newList));
    }
}

module.exports = zamowienia;