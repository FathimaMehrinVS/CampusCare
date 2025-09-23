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
            e.preventDefault();
            
            let isValid = true;
            
            // Validate email
            if (!loginEmail.value) {
                showError(loginEmail, 'Email is required');
                isValid = false;
            } else if (!validateEmail(loginEmail.value)) {
                showError(loginEmail, 'Please enter a valid email address');
                isValid = false;
            } else {
                removeError(loginEmail);
            }
            
            // Validate password
            if (!loginPassword.value) {
                showError(loginPassword, 'Password is required');
                isValid = false;
            } else {
                removeError(loginPassword);
            }
            
            if (isValid) {
                // Show loading state
                const submitBtn = this.querySelector('.btn-primary');
                const originalText = submitBtn.textContent;
                submitBtn.classList.add('loading');
                submitBtn.textContent = 'Signing In...';
                
                // Simulate API call
                setTimeout(() => {
                    alert('Login successful! (This is a demo)');
                    submitBtn.classList.remove('loading');
                    submitBtn.textContent = originalText;
                    
                    // Here you would typically redirect to dashboard or make actual API call
                    // window.location.href = 'dashboard.html';
                }, 2000);
            }
        });
    }
    
    // Signup form submission
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            
            // Validate first name
            if (!firstName.value) {
                showError(firstName, 'First name is required');
                isValid = false;
            } else if (firstName.value.length < 2) {
                showError(firstName, 'First name must be at least 2 characters long');
                isValid = false;
            } else {
                removeError(firstName);
            }
            
            // Validate last name
            if (!lastName.value) {
                showError(lastName, 'Last name is required');
                isValid = false;
            } else if (lastName.value.length < 2) {
                showError(lastName, 'Last name must be at least 2 characters long');
                isValid = false;
            } else {
                removeError(lastName);
            }
            
            // Validate email
            if (!signupEmail.value) {
                showError(signupEmail, 'Email is required');
                isValid = false;
            } else if (!validateEmail(signupEmail.value)) {
                showError(signupEmail, 'Please enter a valid email address');
                isValid = false;
            } else {
                removeError(signupEmail);
            }
            
            // Validate phone
            if (!phone.value) {
                showError(phone, 'Phone number is required');
                isValid = false;
            } else if (!validatePhone(phone.value)) {
                showError(phone, 'Please enter a valid phone number');
                isValid = false;
            } else {
                removeError(phone);
            }
            
            // Validate password
            if (!signupPassword.value) {
                showError(signupPassword, 'Password is required');
                isValid = false;
            } else if (!validatePassword(signupPassword.value)) {
                showError(signupPassword, 'Password must be at least 6 characters long');
                isValid = false;
            } else {
                removeError(signupPassword);
            }
            
            // Validate confirm password
            if (!confirmPassword.value) {
                showError(confirmPassword, 'Please confirm your password');
                isValid = false;
            } else if (confirmPassword.value !== signupPassword.value) {
                showError(confirmPassword, 'Passwords do not match');
                isValid = false;
            } else {
                removeError(confirmPassword);
            }
            
            // Validate terms checkbox
            if (!termsCheckbox.checked) {
                alert('Please agree to the Terms & Conditions');
                isValid = false;
            }
            
            if (isValid) {
                // Show loading state
                const submitBtn = this.querySelector('.btn-primary');
                const originalText = submitBtn.textContent;
                submitBtn.classList.add('loading');
                submitBtn.textContent = 'Creating Account...';
                
                // Simulate API call
                setTimeout(() => {
                    alert('Account created successfully! (This is a demo)');
                    submitBtn.classList.remove('loading');
                    submitBtn.textContent = originalText;
                    
                    // Switch to login form after successful signup
                    switchToLogin();
                }, 2000);
            }
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