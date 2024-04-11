/*
COMP 2406 Final Term Project
By Ibraheem Refai
101259968
April 10, 2024
*/

//Setting up all event listeners to load each time a webpage changes
//Supports dynamic loading of webpages and acts as a single webpage application
function setupEventListeners() {
    const registerLink = document.getElementById("registerLink")
    const backToSignInLink = document.getElementById("backToSignIn")
    const logoutBtn = document.getElementById("logoutBtn")
    const viewUsersBtn = document.getElementById("viewUsersBtn")
    const backToChatroomBtn = document.getElementById("backToChatroomBtn")

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
                loadForm('/')
            })
            .catch(error => console.error('Logout Error:', error));
        })
    }

    if(viewUsersBtn) {
        viewUsersBtn.addEventListener("click", function(e) {
            e.preventDefault()
            loadForm('/viewUsers')
        })
    }

    if(backToChatroomBtn) {
        backToChatroomBtn.addEventListener("click", function(e) {
            e.preventDefault()
            loadForm('/chatroom')
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
            //Explicitly call setupChatroomEventListeners if chatroom content is loaded
            if (url.includes("chatroom") || document.getElementById("sendMsgBtn")) {
                setupChatroomEventListeners()
            }
        })
        .catch(error => console.error('Error loading form:', error))
}


function setupViewUsersButton() {
    const viewUsersBtn = document.getElementById("viewUsersBtn")
    if (viewUsersBtn) {
        viewUsersBtn.addEventListener("click", handleViewUsersButton)
    }
}

document.addEventListener("DOMContentLoaded", function() {
    setupEventListeners()
    setupFormEventListener()
    setupLoginEventListener()
    setupViewUsersButton()
})