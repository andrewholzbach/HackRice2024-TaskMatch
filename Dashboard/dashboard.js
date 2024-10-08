console.log("Dashboard script started")
document.addEventListener('DOMContentLoaded', function() {
    // Fetch the listings from the backend when the page loadsa
    fetch('http://localhost:3001/listings') 
        .then(response => response.json())
        .then(listings => {
            const listingsContainer = document.getElementById('listings-container');
            listingsContainer.innerHTML = ''; // Clear any existing content

            // Check if there are no listings
            if (listings.length === 0) {
                console.log("Listings empty")
                listingsContainer.innerHTML = '<p class="no-listings">No tasks found.</p>';
                return;
            }


            // Loop through each listing and create a task box for it
            listings.forEach(listing => {
                const taskBox = document.createElement('div');
                taskBox.classList.add('task-box');

                // Create the content for each task (name, description, and message button)
                taskBox.innerHTML = `
                    <textarea rows="1" placeholder="Task Name" readonly>${listing.title}</textarea>
                    <textarea rows="4" placeholder="Task Description" readonly>${listing.description}</textarea>
                    <textarea rows="1" placeholder="Price" readonly>Payment: $${listing.price}</textarea>
                    <button class="message-button">Message</button>
                `;

                // Insert the new task at the top of the container
                if (listingsContainer.firstChild) {
                    listingsContainer.insertBefore(taskBox, listingsContainer.firstChild);
                } else {
                    listingsContainer.appendChild(taskBox);
                }
            });
        })
        .catch(error => {
            console.error('Error fetching listings:', error);
            document.getElementById('listings-container').innerHTML = '<p class="no-listings">Error loading tasks.</p>';
        });
});

// Onload for username
window.onload = function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const usernameElement = document.querySelector('.username'); // Select the element to display the username

    if (isLoggedIn) {
        const email = localStorage.getItem('userEmail');
        usernameElement.textContent = email; // Set the profile display to the user's email
    } else {
        usernameElement.textContent = 'Guest'; // Default display if not logged in
    }
};