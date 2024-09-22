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
                    <input type="text" placeholder="Task Name" value="${listing.title}" readonly>
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


document.getElementById('create-account-button').addEventListener('click', function(e) {
    // Prevent default behavior if it's a form submission
    e.preventDefault();

    // Get input values
    const email = document.querySelector('input[placeholder="email"]').value.trim();
    const password = document.querySelector('input[placeholder="password"]').value.trim();

    // Basic validation
    if (!email || !password) {
        alert('Please fill in both fields.');
        return;
    }

    // Create a new account object
    const accountData = {
        email: email,
        password: password
    };

    // Send the account data to the backend via a POST request
    fetch('http://localhost:3001/create-account', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(accountData) // Convert the account data to JSON
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Handle successful account creation
        console.log('Account created successfully:', data);
        localStorage.setItem('userEmail', email)
        localStorage.setItem('isLoggedIn', 'true')
        alert('Account created successfully!');
        
        // Optionally clear the input fields
        document.querySelector('input[placeholder="email"]').value = '';
        document.querySelector('input[placeholder="password"]').value = '';
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error creating account. Please try again.');
    });
});