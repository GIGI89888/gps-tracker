const express = require('express');
const cors = require('cors');
const path = require('path'); // Aggiungi questo modulo, è integrato in Node.js

const app = express();

// --- Middleware ---
app.use(cors()); // Lascialo per massima compatibilità, non fa mai male
app.use(express.json());

// --- NUOVA SEZIONE: Servi i file statici ---
// Questa riga dice a Express di servire qualsiasi file si trovi nella stessa cartella del server.
// __dirname è una variabile speciale di Node.js che contiene il percorso della cartella corrente.
app.use(express.static(path.join(__dirname)));

// --- Sicurezza e Configurazione ---
const IL_MIO_PIN_SEGRETO = "2304";
const CHIAVE_SEGRETA_APP = "supersecretkey_per_app";

// --- Database "finto" ---
let ultimaPosizione = { lat: 0, lng: 0, timestamp: "N/A" };

// --- Endpoint per l'app del telefono ---
app.post('/api/update-location', (req, res) => {
    // ... il tuo codice per aggiornare la posizione rimane identico ...
    const { lat, lng, secretKey } = req.body;
    if (secretKey !== CHIAVE_SEGRETA_APP) return res.status(401).send('Chiave non autorizzata');
    if (!lat || !lng) return res.status(400).send('Dati mancanti');
    ultimaPosizione = { lat, lng, timestamp: new Date().toLocaleString("it-IT") };
    console.log('Posizione aggiornata:', ultimaPosizione);
    res.status(200).send('Posizione ricevuta');
});

// --- Endpoint per il sito web ---
app.post('/api/get-location', (req, res) => {
    // ... il tuo codice per ottenere la posizione rimane identico ...
    const { pin } = req.body;
    if (pin !== IL_MIO_PIN_SEGRETO) return res.status(403).send('PIN non corretto');
    res.json(ultimaPosizione);
});

// --- NUOVA SEZIONE: Gestisci la pagina principale ---
// Se qualcuno visita l'indirizzo principale, gli inviamo il file index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Avvia il server
const PORT = process.env.PORT || 3000; // Usa la porta di Render o 3000 in locale
app.listen(PORT, () => {
    console.log(`Server in ascolto sulla porta ${PORT}`);
});