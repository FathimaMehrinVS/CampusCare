console.log("CampusCare frontend loaded 🚀");
// Modal Elements
const loginModal = document.getElementById("login-modal");
const signupModal = document.getElementById("signup-modal");
const loginBtn = document.getElementById("login-btn");
const signupBtn = document.getElementById("signup-btn");
const closeButtons = document.querySelectorAll(".close");

// Open Modals
loginBtn.onclick = () => loginModal.style.display = "block";
signupBtn.onclick = () => signupModal.style.display = "block";

// Close Modals
closeButtons.forEach(btn => {
  btn.onclick = () => btn.parentElement.parentElement.style.display = "none";
});

// Close modal on outside click
window.onclick = (e) => {
  if (e.target.classList.contains("modal")) {
    e.target.style.display = "none";
  }
}

// Fake Authentication (for now)
let isLoggedIn = false;

// Protected Buttons
document.querySelectorAll(".protected-btn").forEach(btn => {
  btn.addEventListener("click", (e) => {
    if (!isLoggedIn) {
      e.preventDefault();
      alert("Please login first!");
      loginModal.style.display = "block";
    }
  });
});

// Login & Signup Submit (fake, for now)
document.getElementById("login-submit").onclick = () => {
  isLoggedIn = true;
  loginModal.style.display = "none";
  alert("Logged in successfully! 🎉");
};

document.getElementById("signup-submit").onclick = () => {
  isLoggedIn = true;
  signupModal.style.display = "none";
  alert("Signed up successfully! 🎉");
};
