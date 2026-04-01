class resultTests {
    constructor(testName, value) {
        this.testName = testName;
        this.value = value;
    }

    //zwraca interpretacje wybranego badania na podstawie norm medycznych (póżniej dodam dokładniejsze normy)
    getInterpretation() {
        if (this.testName === "Glukoza") {
            if (this.value < 70) return 'Pozytywny';
            if (this.value > 99) return 'Negatywny, skonsultuj się z lekarzem.';
        }

        if (this.testName === 'Morfologia') {
            return this.value >= 10 ? 'W normie' : 'Negatywny(Podwyższony)';
        }

        if (this.testName === 'Cholesterol') {
            return this.value < 200 ? 'W normie' : 'Negatywny (Podwyższony)';
        }

        return 'Skonsultuj się z lekarzem.';
    }
}

module.exports = resultTests;