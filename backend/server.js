// backend/server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3001; // You can use any available port

// Middleware
app.use(bodyParser.json()); // Parse JSON data from the client
app.use(cors()); // Allow cross-origin requests from the front-end

// Temporary storage for listings (In-memory, or connect to a database)
let listings = [];

// Route to handle POST requests for creating a listing
app.post('/create-listing', (req, res) => {
    const { description, price, tags } = req.body;
    if (!description || !price || !tags) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    // Create a new listing object
    const newListing = {
        id: Date.now(), // Generate a unique ID
        description,
        price,
        tags: tags.split(',').map(tag => tag.trim()) // Convert tags to an array
    };

    // Store listing (In a real app, this would be saved to a database)
    listings.push(newListing);

    // Send response back to the client
    res.status(201).json({ message: 'Listing created successfully!', listing: newListing });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});


// Route to return all listings
app.get('/listings', (req, res) => {
    res.json(listings); // Send the listings array as JSON
});