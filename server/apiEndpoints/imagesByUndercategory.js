const express = require('express');
const router = express.Router();
const db = require('../db');

// Define the GET endpoint to use undercategory ID
router.get('/:undercategoryId', (req, res) => {
  const { undercategoryId } = req.params;

  // SQL query to select images based on undercategory ID
  const sql = `
    SELECT img.img_id, img.img_url, img.img_origin
    FROM Image img
    JOIN Image_Undercateg iuc ON img.img_id = iuc.img_id
    WHERE iuc.undercateg_id = ?;
  `;

  db.all(sql, [undercategoryId], (err, rows) => {
    if (err) {
      console.error('Error querying the database:', err.message);
      res.status(500).send('Error querying the database');
      return;
    }

    // Return rows directly with img_url — frontend loads images from URL
    res.json({ images: rows.map(row => ({ ...row, image: row.img_url })) });
  });
});

module.exports = router;
