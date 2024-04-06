const express = require('express')
const router = express.Router()
const sqlite3 = require('sqlite3').verbose() //Verbose provides more detailed stack trace
// Connect to the Database
const db = new sqlite3.Database('../../database/eduChatDatabase.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error('Error connecting to the database: ', err.message)
    }
    else {
        console.log('Connected to the SQLite database successfully!')
    }
})


router.get('/getRegistrationForm', function(request, response) {
    //Arrays to store all the rows from the tables
    let languages = []
    let interests = []
    let majors = []
    let courses = []
    //Fetching all the data from the database for languages, interests, majors, and courses
    //Data will be used to populate the registration form
    db.serialize(function () {
        db.all("SELECT * FROM Languages", function(err, rows) {
            if(err) {console.error(err.message); return;}
            languages = rows
        
            db.all("SELECT * FROM Interests", function(err, rows) {
                if(err) {console.error(err.message); return;}
                interests = rows

                db.all("SELECT * FROM Majors", function(err, rows) {
                    if(err) {console.error(err.message); return;}
                    majors = rows

                    db.all("SELECT * FROM Courses", function(err, rows) {
                        if(err) {console.error(err.message); return;}
                        courses = rows
                    
                        //Render the registration page with the data
                        response.render('registration', {
                            languages,
                            interests,
                            majors,
                            courses
                        });
                    });
                });
            });
        });
    });
});



router.post('/registerStudent', function(request, response) {
    console.log("DATA FROM THE FORM RECIEVED BY THE SERVER: ", request.body)
    const { firstName, lastName, email, password, major, languages, interests, courses } = request.body
    
    //Revalidating the data on the server side (ensuring all fields are filled out and there is a minimum of 3 interests and a maximum of 5 courses)
    if (!email || !firstName || !lastName || !password || !major || interests.length < 3 || courses.length > 5) {
        return response.status(400).json({ error: "Please fill all required fields with valid data!" })
    }

    // Check for unique email
    db.get("SELECT * FROM Students WHERE email = ?", [email], (err, row) => {
        if (err) {
            console.error(err.message);
            return response.status(500).json({ error: "Database operation failed!" })
        }
        if (row) {
            return response.status(400).json({ error: "An account with this email already exists. Emails must be unique." })
        }
        
        //Insert into Students
        db.run("INSERT INTO Students (first_name, last_name, email, password, major_id, secondary_language_id) VALUES (?, ?, ?, ?, ?, ?)", 
               [firstName, lastName, email, password, major, languages], function(err) {
            if (err) {
                console.error(err.message);
                return response.status(500).json({ error: "Failed to insert student!" })
            }
            const studentId = this.lastID
            
            //Insert courses and interests
            courses.forEach(courseId => {
                db.run("INSERT INTO TakesCourses (student_id, course_id) VALUES (?, ?)", [studentId, courseId], (err) => {
                    if (err) console.error(err.message)
                })
            })
            
            interests.forEach(interestId => {
                db.run("INSERT INTO HasInterests (student_id, interest_id) VALUES (?, ?)", [studentId, interestId], (err) => {
                    if (err) console.error(err.message)
                })
            })
            
            return response.json({ message: "Registration successful!" })
        })
    })
})



router.post('/login', function(request, response) {
    console.log("CLIENT REQUESTED TO LOGIN WITH CREDENTIALS: ", request.body)
    const { email, password } = request.body;

    // Query the database for a user with the provided email
    db.get("SELECT * FROM Students WHERE email = ?", [email], (err, user) => {
        if (err) {
            console.error("Database Error:", err.message);
            return response.status(500).json({ error: "Internal Server Error" });
        }
        if (!user) {
            return response.status(401).json({ error: "Invalid email! Try registering an account with this email." });
        }

        // Check if the provided password matches the stored password
        if (user.password === password) {
            // Login successful
            response.json({ message: "Login Successful" });
        } else {
            // Password does not match
            response.status(401).json({ error: "Incorrect password for the account with this email!" });
        }
    });
});


// // Example route: Fetch all majors
// router.get('/api/majors', (req, res) => {
//     db.all("SELECT * FROM Majors", [], (err, rows) => {
//         if (err) res.status(500).json({ error: err.message });
//         else res.json(rows);
//     });
// });

module.exports = router



