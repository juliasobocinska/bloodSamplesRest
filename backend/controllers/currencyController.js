const axios = require('axios');

// Przykładowy, bazowy cennik naszych badań w złotówkach (PLN)
const basePricesPLN = {
    "Glukoza": 15.00,
    "Morfologia": 25.00,
    "Cholesterol": 30.00,
    "Witamina_D3": 80.00,
    "Pakiet_Tarczycowy": 120.00
};

const currencyController = {
    // Pobieranie cennika w wybranej walucie
    getPriceListInCurrency: async (req, res) => {
        try {
            // Pobieramy kod waluty z paska adresu URL i zamieniamy na wielkie litery (np. eur -> EUR)
            const currencyCode = req.params.code.toUpperCase();
            
            // Konstruujemy URL do oficjalnego API NBP (Tabela A)
            const nbpUrl = `http://api.nbp.pl/api/exchangerates/rates/A/${currencyCode}/?format=json`;
            
            // Czekamy na odpowiedź z NBP
            const response = await axios.get(nbpUrl);
            const rate = response.data.rates[0].mid; // Wyciągamy sam uśredniony kurs

            // Mechanizm biznesowy: przeliczamy cennik na nową walutę
            const convertedPrices = {};
            for (const [testName, pricePLN] of Object.entries(basePricesPLN)) {
                // Dzielimy cenę w PLN przez kurs i zaokrąglamy do 2 miejsc po przecinku
                convertedPrices[testName] = parseFloat((pricePLN / rate).toFixed(2));
            }

            // Odsyłamy piękny, ustrukturyzowany JSON do Frontendu
            return res.status(200).json({
                base_currency: 'PLN',
                target_currency: currencyCode,
                current_exchange_rate: rate,
                effective_date: response.data.rates[0].effectiveDate,
                prices: convertedPrices
            });

        } catch (error) {
            // Obsługa błędu, gdy np. pacjent wpisze wymyśloną walutę typu "XYZ"
            if (error.response && error.response.status === 404) {
                return res.status(404).json({ error: "Nie znaleziono takiej waluty w tabelach NBP. Spróbuj EUR, USD, GBP, CHF." });
            }
            console.error("Błąd połączenia z NBP:", error.message);
            return res.status(500).json({ error: "Błąd serwera NBP. Cennik chwilowo niedostępny." });
        }
    }
};

module.exports = currencyController;