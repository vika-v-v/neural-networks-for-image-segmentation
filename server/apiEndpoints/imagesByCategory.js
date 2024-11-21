// ! NOT WORKING

const express = require('express');
const router = express.Router();
const db = require('../db');

// Define the GET endpoint to use category ID
router.get('/:categoryId', (req, res) => {
  const { categoryId } = req.params; // Use destructuring to get categoryId from params

  // Adjusted SQL query to filter by category ID
  const sql = `
    SELECT img.img_id, img.img_url, img.img_origin
    FROM Image img
    INNER JOIN Image_Undercateg iuc ON img.img_id = iuc.img_id
    INNER JOIN Undercategory uc ON iuc.undercateg_id = uc.ucateg_id
    INNER JOIN Category c ON uc.categ_id = c.categ_id
    WHERE c.categ_id = ?  // Use category ID for filtering
    ORDER BY img.img_id;
  `;

  // Execute the query with categoryId as parameter
  db.all(sql, [categoryId], (err, rows) => {
    if (err) {
      console.error('Error querying the database:', err.message);
      res.status(500).send('Error querying the database');
      return;
    }
    // Return the result as a JSON object
    res.json({ images: rows });
  });
});

module.exports = router;
