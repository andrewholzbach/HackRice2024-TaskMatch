document.addEventListener('DOMContentLoaded', function() {
    // Fetch the listings from the backend when the page loadsa
    fetch('http://localhost:3001/listings') // Replace with your backend URL
        
        .then(response => response.json())
        .then(listings => {
            const listingsContainer = document.getElementById('listings-container');
            listingsContainer.innerHTML = ''; // Clear any existing content

            // Check if there are no listings
            if (listings.length === 0) {
                listingsContainer.innerHTML = '<p class="no-listings">No tasks found.</p>';
                return;
            }


            // Loop through each listing and create a task box for it
            listings.forEach(listing => {
                const taskBox = document.createElement('div');
                taskBox.classList.add('task-box');

                // Create the content for each task (name, description, and message button)
                taskBox.innerHTML = `
                    <input type="text" placeholder="Task Name" value="${listing.name}" readonly>
                    <textarea rows="4" placeholder="Task Description" readonly>${listing.description}</textarea>
                    <button class="message-button">Message</button>
                `;

                // Append each task to the container
                listingsContainer.appendChild(taskBox);
            });
        })
        .catch(error => {
            console.error('Error fetching listings:', error);
            document.getElementById('listings-container').innerHTML = '<p class="no-listings">Error loading tasks.</p>';
        });
});
