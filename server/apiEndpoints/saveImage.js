const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/add', (req, res) => {
    const { url, undercategories } = req.body;
  
    if (!url || !undercategories || !Array.isArray(undercategories)) {
      return res.status(400).json({ error: 'Missing or invalid fields' });
    }
  
    const sql = `INSERT INTO Image (img_url, img_origin) VALUES (?, ?)`;
    db.run(sql, [url, 'user-upload'], function (err) {
      if (err) {
        console.error('Error inserting image:', err.message);
        return res.status(500).json({ error: 'Error saving image' });
      }
  
      const imgId = this.lastID; // Get the newly inserted image ID
  
      const mappingSql = `INSERT INTO Image_Undercateg (img_id, undercateg_id) VALUES (?, ?)`;
      const mappings = undercategories.map((undercategId) => [imgId, undercategId]);
  
      // Insert all mappings
      const stmt = db.prepare(mappingSql);
      mappings.forEach((mapping) => {
        stmt.run(mapping, (err) => {
          if (err) {
            console.error('Error mapping image to undercategory:', err.message);
          }
        });
      });
      stmt.finalize();
  
      res.status(201).json({ message: 'Image saved successfully', imgId });
    });
  });  

module.exports = router;