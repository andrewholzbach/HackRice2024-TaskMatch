document.addEventListener('DOMContentLoaded', function() {
    // Fetch the listings from the backend when the page loadsa
    fetch('http://localhost:3001/listings') 
        
        .then(response => response.json())
        .then(listings => {
            const listingsContainer = document.getElementById('listings-container');
            listingsContainer.innerHTML = ''; // Clear any existing content

            if (listings.length === 0) {
                listingsContainer.innerHTML = '<p class="no-listings">No tasks found.</p>';
                return;
            }


            listings.forEach(listing => {
                const taskBox = document.createElement('div');
                taskBox.classList.add('task-box');

                taskBox.innerHTML = `
                    <input type="text" placeholder="Task Name" value="${listing.name}" readonly>
                    <textarea rows="4" placeholder="Task Description" readonly>${listing.description}</textarea>
                    <button class="message-button">Message</button>
                `;

                listingsContainer.appendChild(taskBox);
            });
        })
        .catch(error => {
            console.error('Error fetching listings:', error);
            document.getElementById('listings-container').innerHTML = '<p class="no-listings">Error loading tasks.</p>';
        });
});
