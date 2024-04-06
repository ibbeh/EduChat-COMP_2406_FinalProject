//Function to handle the submission of the registration form
function handleRegistrationSubmit(event) {
    event.preventDefault() //Prevent the form from submitting with default behaviour

    //Directly collecting values from form elements
    const data = {
    firstName: document.getElementById('firstName').value,
    lastName: document.getElementById('lastName').value,
    email: document.getElementById('email').value,
    password: document.getElementById('password').value,
    languages: document.getElementById('languages').value,
    major: document.getElementById('major').value,
    interests: [],
    courses: []
    }

    //Collecting checkbox values for interests
    document.querySelectorAll('#interestsSelection .form-check-input:checked').forEach(function(checkbox) {
        data.interests.push(checkbox.value)
    })

    //Collecting checkbox values for courses
    document.querySelectorAll('#courseSelection .form-check-input:checked').forEach(function(checkbox) {
        data.courses.push(checkbox.value)
    })
    
    console.log("DATA SUBMITTED TO THE FORM:", data)

    //Perform client-side validation to ensure all of the fields are filled out correctly
    //i.e. none of the fields can be empty, there can be a minimum of 3 interests and a maximum of 5 enrolled courses.
    if (!data.email || !data.password || !data.firstName || !data.lastName || !data.major || !data.languages || !data.interests || !data.courses) {
        alert("Please fill all required fields correctly and make sure no fields are empty.")
        return
    }

    if (data.interests.length < 3) {
        alert("You must choose at least 3 interests.")
        return
    }

    if(data.courses.length > 5) {
        alert("You must choose at most 5 courses.")
        return
    }


    //Ensure the email is ina valid format before submitting registration data
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(data.email)) {
        alert("Please enter a valid email address.");
        return
    }

    //Send the data to the server using fetch API
    fetch('/registerStudent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data), //Convert the data object to JSON
    })
    .then(response => response.json()) //Parse the JSON response
    .then(responseData => {
        if (responseData.error) { //Check for errors in the response
            alert(`Error: ${responseData.error}`)
        } 
        else {
            alert('Registration successful! Redirecting you to the login page where you may now login.') //Notify the user of successful registration
            // registrationForm.reset() //Reset the form
            window.location.href = '/' //Redirect to the login page
        }
    })
    .catch(error => {
        //Log and alert any errors
        console.error('Error:', error)
        alert('An error occurred. Please try again.')
    })
}

// module.exports = { handleRegistrationSubmit }


function handleLoginSubmit(event) {
    event.preventDefault(); // Prevent default form submission

    const email = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Send the login credentials to the server
    fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    })
    .then(response => response.json())
    .then(responseData => {
        if (responseData.error) {
            alert(`Login Failed: ${responseData.error}`);
        } else {
            alert('Login Successful! Redirecting...');
            // Handle successful login, e.g., redirecting to another page
            window.location.href = '/chatroom'
        }
    })
    .catch(error => {
        console.error('Login Error:', error);
        alert('An error occurred during login. Please try again.');
    });
}
