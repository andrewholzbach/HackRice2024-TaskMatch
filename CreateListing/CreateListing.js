// src/CreateListing.js
document.getElementById('listingForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent the form from refreshing the page

    // Get form values
    const description = document.getElementById('description').value;
    const price = document.getElementById('price').value;
    const tags = document.getElementById('tags').value;

    // Create a new listing object
    const listingData = {
        description: description,
        price: price,
        tags: tags
    };

    // Send the listing to the backend via a POST request
    fetch('http://localhost:3001/create-listing', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(listingData) // Convert the listing data to JSON
    })
    .then(response => response.json())
    .then(data => {
        // Display the created listing
        document.getElementById('outputDescription').textContent = `Description: ${data.listing.description}`;
        document.getElementById('outputPrice').textContent = `Price: $${data.listing.price}`;
        document.getElementById('outputTags').textContent = `Tags: ${data.listing.tags.join(', ')}`;
        document.getElementById('listingOutput').style.display = 'block';
    })
    .catch(error => {
        console.error('Error:', error);
    });

    // Optionally, clear the form fields
    document.getElementById('listingForm').reset();
});
