const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// --- Middleware ---
app.use(cors({ origin: '*' })); // Lasciamo l'origine aperta per semplicità
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// --- Sicurezza e Configurazione ---
const IL_MIO_PIN_SEGRETO = "2304";
const CHIAVE_SEGRETA_APP = "supersecretkey_per_app";

// --- Database "finto" ---
// Aggiungiamo il campo per la batteria!
let ultimaPosizione = { lat: 0, lng: 0, battery: -1, timestamp: "N/A" };

// --- Endpoint per l'app del telefono ---
app.post('/api/update-location', (req, res) => {
    // Leggiamo anche la batteria dal corpo della richiesta
    const { lat, lng, battery, secretKey } = req.body;

    if (secretKey !== CHIAVE_SEGRETA_APP) {
        return res.status(401).send('Chiave non autorizzata');
    }
    // Aggiungiamo il controllo per la batteria
    if (lat === undefined || lng === undefined || battery === undefined) {
        return res.status(400).send('Dati mancanti (lat, lng, o battery)');
    }

    // Salviamo tutti i nuovi dati
    ultimaPosizione = {
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        battery: parseInt(battery),
        timestamp: new Date().toLocaleString("it-IT", { timeZone: "Europe/Rome" })
    };

    console.log('Posizione e batteria aggiornate:', ultimaPosizione);
    res.status(200).send('Dati ricevuti');
});

// --- Endpoint per il sito web ---
// Questo non cambia, invierà l'intero oggetto `ultimaPosizione`
app.post('/api/get-location', (req, res) => {
    const { pin } = req.body;
    if (pin !== IL_MIO_PIN_SEGRETO) {
        return res.status(403).send('PIN non corretto');
    }
    res.json(ultimaPosizione);
});

// ... il resto del codice per servire la pagina e avviare il server rimane uguale ...
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server in ascolto sulla porta ${PORT}`);
});
app.listen(PORT, () => {
    console.log(`Server in ascolto sulla porta ${PORT}`);
});
