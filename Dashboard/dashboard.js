// Dashboard.js

// Store all listings globally for filtering
let allListings = [];

// Fetch listings from the backend
async function fetchListings() {
    try {
        const response = await fetch('http://localhost:3001/listings');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        allListings = await response.json();
        displayListings(allListings);
    } catch (error) {
        console.error('Error fetching listings:', error);
    }
}

// Display listings on the dashboard
function displayListings(listings) {
    const listingsContainer = document.getElementById('listings-container');

    // Clear existing listings
    listingsContainer.innerHTML = '';

    if (listings.length === 0) {
        listingsContainer.innerHTML = '<p>No listings found.</p>';
        return;
    }

    listings.forEach(listing => {
        const listingCard = document.createElement('div');
        listingCard.classList.add('listing-card');

        listingCard.innerHTML = `
            <h3>${listing.description}</h3>
            <p><strong>Price:</strong> $${listing.price}</p>
            <p><strong>Tags:</strong> ${listing.tags.join(', ')}</p>
        `;

        listingsContainer.appendChild(listingCard);
    });
}

// Filter listings based on search input and dropdowns
function filterListings() {
    const searchInput = document.querySelector('.search-bar').value.toLowerCase();
    const category = document.getElementById('dropdown1').value;
    const priceRange = document.getElementById('dropdown2').value;
    const tag = document.getElementById('dropdown3').value;

    let filteredListings = allListings;

    // Filter by search input
    if (searchInput) {
        filteredListings = filteredListings.filter(listing =>
            listing.description.toLowerCase().includes(searchInput)
        );
    }

    // Filter by category (assuming category is a property of listing)
    if (category) {
        filteredListings = filteredListings.filter(listing =>
            listing.category === category
        );
    }

    // Filter by price range
    if (priceRange) {
        const [minPrice, maxPrice] = priceRange.split('-').map(Number);
        filteredListings = filteredListings.filter(listing =>
            listing.price >= minPrice && listing.price <= maxPrice
        );
    }

    // Filter by tag
    if (tag) {
        filteredListings = filteredListings.filter(listing =>
            listing.tags.includes(tag)
        );
    }

    displayListings(filteredListings);
}

// Add event listeners for search and filter inputs
document.querySelector('.search-bar').addEventListener('input', filterListings);
document.getElementById('dropdown1').addEventListener('change', filterListings);
document.getElementById('dropdown2').addEventListener('change', filterListings);
document.getElementById('dropdown3').addEventListener('change', filterListings);

// Fetch and display listings when the page loads
document.addEventListener('DOMContentLoaded', fetchListings);
