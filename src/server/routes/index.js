const express = require('express')
const router = express.Router()
const sqlite3 = require('sqlite3').verbose() //Verbose provides more detailed stack trace
// Connect to the Database
const db = new sqlite3.Database('../../database/eduChatDatabase.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) console.error(err.message);
    else console.log('Connected to the SQLite database.');
});


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
    

// // Example route: Fetch all majors
// router.get('/api/majors', (req, res) => {
//     db.all("SELECT * FROM Majors", [], (err, rows) => {
//         if (err) res.status(500).json({ error: err.message });
//         else res.json(rows);
//     });
// });

module.exports = router



