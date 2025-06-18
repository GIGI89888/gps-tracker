const express = require('express');
const cors = require('cors');
const app = express();

console.log("Server script avviato."); // LOG 1

// --- Middleware ---
app.use(cors());
app.use(express.json());

// Aggiungiamo un middleware di logging per vedere TUTTE le richieste in arrivo
app.use((req, res, next) => {
    console.log(`Richiesta ricevuta: ${req.method} ${req.originalUrl}`); // LOG 2
    next(); // Passa alla prossima rotta
});

// ... il resto del codice (sicurezza, database finto)...
const IL_MIO_PIN_SEGRETO = "2304";
const CHIAVE_SEGRETA_APP = "supersecretkey_per_app";
let ultimaPosizione = { lat: 0, lng: 0, timestamp: "N/A" };


// --- Endpoint ---
app.post('/api/update-location', (req, res) => {
    console.log("Richiesta su /api/update-location"); // LOG 3
    const { lat, lng, secretKey } = req.body;
    if (secretKey !== CHIAVE_SEGRETA_APP) return res.status(401).send('Chiave non autorizzata');
    if (!lat || !lng) return res.status(400).send('Dati mancanti');
    ultimaPosizione = { lat, lng, timestamp: new Date().toLocaleString("it-IT") };
    console.log('Posizione aggiornata:', ultimaPosizione);
    res.status(200).send('Posizione ricevuta');
});

app.post('/api/get-location', (req, res) => {
    console.log("Richiesta su /api/get-location con PIN:", req.body.pin); // LOG 4
    const { pin } = req.body;
    if (pin !== IL_MIO_PIN_SEGRETO) {
        console.log("PIN non corretto.");
        return res.status(403).send('PIN non corretto');
    }
    console.log("PIN corretto, invio posizione.");
    res.json(ultimaPosizione);
});

app.get('/', (req, res) => {
    res.send('Ciao! Il server del tracker è online.');
});

console.log("Rotte API definite."); // LOG 5

// --- Avvio del server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server in ascolto sulla porta ${PORT}`);
});
