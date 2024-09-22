// backend/server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3001; 

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
                user TEXT,
                description TEXT,
                title TEXT,
                price REAL,
                tags TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE,
                password TEXT
            )
        `);
        
    }
});

// Route to handle POST requests for creating a listing
app.post('/create-listing', (req, res) => {
    console.log("Listing created")
    const { name, description, price, tags } = req.body;

    if (!name || !description || !price || !tags) {
        return res.status(400).json({ error: 'Please provide all fields.' });
    }

    db.run(
        `INSERT INTO listings (user, description, title, price, tags, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
        [name, description, price, tags, new Date().toISOString()], // Adding the current time
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
        res.json(rows);
    });
});
  
// DELETE endpoint to remove a listing by ID
app.delete('/listings/:id', (req, res) => {
    const listingId = req.params.id;

    db.run(`DELETE FROM listings WHERE id = ?`, listingId, function (err) {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        // Check if a row was deleted
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Listing not found' });
        }

        res.status(200).json({ message: 'Listing deleted successfully' });
    });
});



// CREATE ACCOUNT endpoint
app.post('/create-account', (req, res) => {
    const { email, password } = req.body;

    // Insert the new user into the database
    db.run(
        `INSERT INTO users (email, password) VALUES (?, ?)`,
        [email, password],
        function (err) {
            if (err) {
                // Check for unique constraint violation (duplicate email)
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(400).json({ error: 'Email already taken' });
                }
                return res.status(500).json({ error: 'Database error' });
            }
            res.status(201).json({ id: this.lastID, email });
        }
    );
});