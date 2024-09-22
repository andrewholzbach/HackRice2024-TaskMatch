// backend/server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3001; // You can use any available port

// Middleware
app.use(bodyParser.json()); // Parse JSON data from the client
app.use(cors()); // Allow cross-origin requests from the front-end

// Connect to SQLite database
const db = new sqlite3.Database('./listings.db', (err) => {
    if (err) {
        console.error('Error opening the database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        db.run(`
            CREATE TABLE IF NOT EXISTS listings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            description TEXT,
            price REAL,
            tags TEXT
            )
        `);
    }
});2

// Route to handle POST requests for creating a listing
app.post('/create-listing', (req, res) => {
    console.log("Listing created")
    const { name, description, price, tags } = req.body;

    if (!name || !description || !price || !tags) {
        return res.status(400).json({ error: 'Please provide all fields.' });
    }

    db.run(
        `INSERT INTO listings (name, description, price, tags) VALUES (?, ?, ?, ?)`,
        [name, description, price, tags],
        function (err) {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(201).json({ id: this.lastID });
        }
    );
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});


// GET: Fetch all listings
app.get('/listings', (req, res) => {
    console.log(`Fetching listings`)
    db.all('SELECT * FROM listings', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        console.log(rows)
        res.json(rows);
    });
});
  