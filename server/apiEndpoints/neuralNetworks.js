const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();

// Connect to the database
const db = new sqlite3.Database('./mydatabase.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error('Database connection error:', err.message);
        return;
    }
    console.log('Connected to the database.');
});

// Define the GET endpoint to fetch all neural networks
router.get('/', (req, res) => {
    const sql = "SELECT nn_id AS id, nn_name AS name FROM Neural_Network";

    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Error querying the database:', err.message);
            res.status(500).send('Error querying the database');
            return;
        }
        res.json(rows);
    });
});

module.exports = router;
