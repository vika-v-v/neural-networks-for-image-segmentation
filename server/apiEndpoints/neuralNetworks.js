const express = require('express');
const router = express.Router();
const db = require('../db');

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
