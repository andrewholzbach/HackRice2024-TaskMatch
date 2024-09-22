// src/CreateListing.js
document.getElementById('listingForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent the form from refreshing the page

    // Get form values
    const description = document.getElementById('description').value;
    const price = document.getElementById('price').value;
    const tags = document.getElementById('tags').value;

    // Create a new listing object
    const listingData = {
        name: "example",
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
    .then(
        response => response.json()
    )
    .then(data => {
        // Display the created listing
        console.log(data)
    })
    .catch(error => {
        console.error('Error:', error);
    });

    document.getElementById('listingForm').reset();
});
