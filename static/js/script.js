document.addEventListener('DOMContentLoaded', function() {
    const authModal = document.getElementById('auth-modal');
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
    const closeBtn = authModal.querySelector('.close');

    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    // Only add listeners if the buttons exist (i.e., user is not logged in)
    if (loginBtn && signupBtn) {
        // Function to open the modal and show the login form
        loginBtn.onclick = function(e) {
            e.preventDefault();
            authModal.style.display = 'block';
            loginForm.classList.add('active');
            signupForm.classList.remove('active');
        }
        // Function to open the modal and show the signup form
        signupBtn.onclick = function(e) {
            e.preventDefault();
            authModal.style.display = 'block';
            signupForm.classList.add('active');
            loginForm.classList.remove('active');
        }
    }

    // Function to close the modal
    closeBtn.onclick = function() {
        authModal.style.display = 'none';
    }

    // Close modal if user clicks outside of the content
    window.onclick = function(event) {
        if (event.target == authModal) {
            authModal.style.display = 'none';
        }
    }

    // Handle protected links (for future use if needed)
    const protectedButtons = document.querySelectorAll('.protected-btn');
    protectedButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // A simple check: if the login button doesn't exist, the user is logged in.
            const isLoggedIn = !document.getElementById('login-btn');

            if (!isLoggedIn) {
                e.preventDefault();
                flash('Please log in to access this feature.', 'error');
                // Optionally, open the login modal
                authModal.style.display = 'block';
                loginForm.classList.add('active');
                signupForm.classList.remove('active');
            }
        });
    });

    // Helper function to show a temporary message
    function flash(message, category) {
        const flashContainer = document.querySelector('.flash-messages');
        if (flashContainer) {
            const flashDiv = document.createElement('div');
            flashDiv.className = `flash ${category}`;
            flashDiv.textContent = message;
            flashContainer.prepend(flashDiv);
            setTimeout(() => flashDiv.remove(), 4000);
        }
    }
});