const express = require('express');
const router = express.Router();
const databaseOperations = require("../databaseOperations");
const db = require('../db');

// In apiEndpoints/imageById.js
router.get('/:imgId', (req, res) => {
  const imgId = req.params.imgId;

  const sqlImage = `SELECT img_id, img_url, img_origin FROM Image WHERE img_id = ?`;
  const sqlUnderCategories = `
    SELECT uc.ucateg_id, uc.ucateg_name, c.categ_name
    FROM Undercategory uc
    JOIN Image_Undercateg iuc ON uc.ucateg_id = iuc.undercateg_id
    JOIN Category c ON uc.categ_id = c.categ_id
    WHERE iuc.img_id = ?`;

  db.get(sqlImage, [imgId], (err, image) => {
    if (err) {
      console.error('Error fetching image:', err.message);
      return res.status(500).json({ error: 'Error fetching image' });
    }

    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    db.all(sqlUnderCategories, [imgId], (err, undercategories) => {
      if (err) {
        console.error('Error fetching undercategories:', err.message);
        return res.status(500).json({ error: 'Error fetching undercategories' });
      }

      res.status(200).json({ image, undercategories });
    });
  });
});


module.exports = router;
