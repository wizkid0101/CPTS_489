const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static(__dirname));

// Connect to SQLite database
const db = new sqlite3.Database('./petition.db', (err) => {
    if (err) console.error(err.message);
    else console.log('Connected to SQLite database.');
});

// Create table
db.run(`
    CREATE TABLE IF NOT EXISTS signatures (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        city TEXT NOT NULL,
        state TEXT NOT NULL
    )
`, (err) => {
    if (err) console.error(err.message);
});

// Add signature
app.post('/sign', (req, res) => {
    const { name, email, city, state } = req.body;
    if (!name || !email || !city || !state) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    const query = `INSERT INTO signatures (name, email, city, state) VALUES (?, ?, ?, ?)`;
    db.run(query, [name, email, city, state], function (err) {
        if (err) {
            if (err.message.includes("UNIQUE constraint failed")) {
                return res.status(400).json({ error: 'Email already exists.' });
            }
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: this.lastID, name, city, state });
    });
});

// Get all signatures
app.get('/signatures', (req, res) => {
    const query = `SELECT name, city, state FROM signatures ORDER BY id DESC`;
    db.all(query, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Route for /
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'petition.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
