function setupEventListeners() {
    const registerLink = document.getElementById("registerLink")
    const backToSignInLink = document.getElementById("backToSignIn")
    const logoutBtn = document.getElementById("logoutBtn")

    if (registerLink) {
        registerLink.addEventListener("click", function(e) {
            e.preventDefault()
            loadForm('/getRegistrationForm')
        })
    }

    if (backToSignInLink) {
        backToSignInLink.addEventListener("click", function(e) {
            e.preventDefault()
            loadForm('/')
        })
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", function() {
            fetch('/logout', { method: 'POST' })
            .then(() => {
                loadForm('/') //Load the login form dynamically after logging out
            })
            .catch(error => console.error('Logout Error:', error));
        })
    }


}

function setupFormEventListener() {
    const registrationForm = document.getElementById("registrationForm")
    if (registrationForm) {
        registrationForm.removeEventListener("submit", handleRegistrationSubmit) //Remove any existing listener to avoid duplicates
        registrationForm.addEventListener("submit", handleRegistrationSubmit)
    }
}

function setupLoginEventListener() {
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", handleLoginSubmit);
    }
}


function loadForm(url) {
    fetch(url)
        .then(response => response.text())
        .then(html => {
            document.querySelector(".container").innerHTML = html
            setupEventListeners() //Re-setup event listeners after new content is loaded for links
            setupFormEventListener() //Setup event listeners For the registration form
            setupLoginEventListener() //Setup event listeners for login form
        })
        .catch(error => console.error('Error loading form:', error))
}

document.addEventListener("DOMContentLoaded", function() {
    setupEventListeners()
    setupFormEventListener()
    setupLoginEventListener()
})