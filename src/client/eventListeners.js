function setupEventListeners() {
    const registerLink = document.getElementById("registerLink")
    const backToSignInLink = document.getElementById("backToSignIn")

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
}

function setupFormEventListener() {
    const registrationForm = document.getElementById("registrationForm")
    if (registrationForm) {
        registrationForm.removeEventListener("submit", handleRegistrationSubmit) //Remove any existing listener to avoid duplicates
        registrationForm.addEventListener("submit", handleRegistrationSubmit)
    }
}

function loadForm(url) {
    fetch(url)
        .then(response => response.text())
        .then(html => {
            document.querySelector(".container").innerHTML = html
            setupEventListeners() //Re-setup event listeners after new content is loaded for links
            setupFormEventListener() //For the registration form
        })
        .catch(error => console.error('Error loading form:', error))
}

document.addEventListener("DOMContentLoaded", function() {
    setupEventListeners()
    setupFormEventListener()
})


