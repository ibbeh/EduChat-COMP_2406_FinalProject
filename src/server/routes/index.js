const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose(); //Verbose provides more detailed stack trace

// // Initialize DB
// const db = new sqlite3.Database('./data/database.sqlite', sqlite3.OPEN_READWRITE, (err) => {
//     if (err) console.error(err.message);
//     else console.log('Connected to the SQLite database.');
// });

// // Example route: Fetch all majors
// router.get('/api/majors', (req, res) => {
//     db.all("SELECT * FROM Majors", [], (err, rows) => {
//         if (err) res.status(500).json({ error: err.message });
//         else res.json(rows);
//     });
// });

module.exports = router;
