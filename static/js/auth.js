// Form switching functionality
function switchToSignup() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    loginForm.classList.remove('active');
    setTimeout(() => {
        signupForm.classList.add('active');
    }, 200);
}

function switchToLogin() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    signupForm.classList.remove('active');
    setTimeout(() => {
        loginForm.classList.add('active');
    }, 200);
}

// Password visibility toggle
function togglePassword(inputId, toggleElement) {
    const input = document.getElementById(inputId);
    const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
    input.setAttribute('type', type);
    
    // Change icon
    toggleElement.textContent = type === 'password' ? '👁️' : '🙈';
}

// Form validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\+]?[1-9][\d]{0,15}$/;
    return re.test(phone.replace(/[\s\-\(\)]/g, ''));
}

function validatePassword(password) {
    return password.length >= 6;
}

// Show error message
function showError(input, message) {
    const inputGroup = input.parentElement;
    let errorElement = inputGroup.querySelector('.error-message');
    
    if (!errorElement) {
        errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        errorElement.style.color = '#ff4757';
        errorElement.style.fontSize = '12px';
        errorElement.style.marginTop = '4px';
        errorElement.style.display = 'block';
        inputGroup.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    input.style.borderColor = '#ff4757';
}

// Remove error message
function removeError(input) {
    const inputGroup = input.parentElement;
    const errorElement = inputGroup.querySelector('.error-message');
    
    if (errorElement) {
        errorElement.remove();
    }
    
    input.style.borderColor = '#e8e8e8';
}
function getRedirectUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('redirect');
}

// Real-time validation
document.addEventListener('DOMContentLoaded', function() {
    // Login form validation
    const loginForm = document.querySelector('#loginForm .auth-form');
    const loginEmail = document.getElementById('loginEmail');
    const loginPassword = document.getElementById('loginPassword');
    
    // Signup form validation
    const signupForm = document.querySelector('#signupForm .auth-form');
    const signupEmail = document.getElementById('signupEmail');
    const signupPassword = document.getElementById('signupPassword');
    const confirmPassword = document.getElementById('confirmPassword');
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const phone = document.getElementById('phone');
    const termsCheckbox = document.querySelector('input[name="terms"]');
    
    // Email validation
    [loginEmail, signupEmail].forEach(input => {
        if (input) {
            input.addEventListener('blur', function() {
                if (this.value && !validateEmail(this.value)) {
                    showError(this, 'Please enter a valid email address');
                } else {
                    removeError(this);
                }
            });
        }
    });
    
    // Password validation
    if (signupPassword) {
        signupPassword.addEventListener('blur', function() {
            if (this.value && !validatePassword(this.value)) {
                showError(this, 'Password must be at least 6 characters long');
            } else {
                removeError(this);
            }
        });
    }
    
    // Confirm password validation
    if (confirmPassword) {
        confirmPassword.addEventListener('blur', function() {
            if (this.value && this.value !== signupPassword.value) {
                showError(this, 'Passwords do not match');
            } else {
                removeError(this);
            }
        });
    }
    
    // Phone validation
    if (phone) {
        phone.addEventListener('blur', function() {
            if (this.value && !validatePhone(this.value)) {
                showError(this, 'Please enter a valid phone number');
            } else {
                removeError(this);
            }
        });
    }
    
    // Name validation
    [firstName, lastName].forEach(input => {
        if (input) {
            input.addEventListener('blur', function() {
                if (this.value && this.value.length < 2) {
                    showError(this, 'Name must be at least 2 characters long');
                } else {
                    removeError(this);
                }
            });
        }
    });
    
    // Login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            // The form will now submit to the backend. Client-side validation can still be useful.
        });
    }
    
    // Signup form submission
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            // The form will now submit to the backend.
        });
    }
    
    // Input focus effects
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
    
    // Add smooth animations on page load
    setTimeout(() => {
        document.querySelector('.form-container').style.opacity = '1';
        document.querySelector('.form-container').style.transform = 'translateY(0)';
    }, 100);
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Switch forms with Tab + Shift
    if (e.key === 'Tab' && e.shiftKey && e.ctrlKey) {
        e.preventDefault();
        const loginForm = document.getElementById('loginForm');
        if (loginForm.classList.contains('active')) {
            switchToSignup();
        } else {
            switchToLogin();
        }
    }
});

// Form data collection functions (for API integration)
function getLoginData() {
    return {
        email: document.getElementById('loginEmail').value,
        password: document.getElementById('loginPassword').value,
        remember: document.querySelector('#loginForm input[name="remember"]').checked
    };
}

function getSignupData() {
    return {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('signupEmail').value,
        phone: document.getElementById('phone').value,
        password: document.getElementById('signupPassword').value,
        acceptedTerms: document.querySelector('input[name="terms"]').checked
    };
}

// API integration helper functions
async function loginUser(userData) {
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });
        
        if (response.ok) {
            const result = await response.json();
            return { success: true, data: result };
        } else {
            const error = await response.json();
            return { success: false, error: error.message };
        }
    } catch (error) {
        return { success: false, error: 'Network error occurred' };
    }
}

async function signupUser(userData) {
    try {
        const response = await fetch('/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });
        
        if (response.ok) {
            const result = await response.json();
            return { success: true, data: result };
        } else {
            const error = await response.json();
            return { success: false, error: error.message };
        }
    } catch (error) {
        return { success: false, error: 'Network error occurred' };
    }
}