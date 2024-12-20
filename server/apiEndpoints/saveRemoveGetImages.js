const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  const sql = 'SELECT img_id, img_url, img_origin FROM Image';
  db.all(sql, [], (err, images) => {
    if (err) {
      console.error('Error fetching images:', err.message);
      return res.status(500).json({ error: 'Error fetching images' });
    }
    res.json({ images });
  });
});

router.post('/add', (req, res) => {
    const { url, undercategories } = req.body;
  
    if (!url || !undercategories || !Array.isArray(undercategories)) {
      return res.status(400).json({ error: 'Missing or invalid fields' });
    }

    console.log('Adding image...');
  
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

      let pending = mappings.length;
      if (pending === 0) {
        // If there are no mappings, finalize the statement and send the response
        stmt.finalize();
        return res.status(201).json({ message: 'Image saved successfully', imgId });
      }

      let hasError = false;
      mappings.forEach((mapping) => {
        stmt.run(mapping, (err) => {
          if (err) {
            console.error('Error mapping image to undercategory:', err.message);
            hasError = true;
          }

          pending--;

          if (pending === 0) {
            stmt.finalize((err) => {
              if (err) {
                console.error('Error finalizing statement:', err.message);
                return res.status(500).json({ error: 'Error finalizing statement' });
              }
              if (hasError) {
                return res.status(500).json({ error: 'Error saving image mappings' });
              }
              res.status(201).json({ message: 'Image saved successfully', imgId });
            }); 
          }
        });
      });
    });
  });  

  router.delete('/remove/:imgId', (req, res) => {
    const { imgId } = req.params;

    if (!imgId) {
        return res.status(400).json({ error: 'Image ID is required' });
    }

    // Delete mappings first
    const deleteMappingsSql = `DELETE FROM Image_Undercateg WHERE img_id = ?`;
    db.run(deleteMappingsSql, [imgId], (err) => {
        if (err) {
            console.error('Error deleting image mappings:', err.message);
            return res.status(500).json({ error: 'Error deleting image mappings' });
        }

        // Then delete the image itself
        const deleteImageSql = `DELETE FROM Image WHERE img_id = ?`;
        db.run(deleteImageSql, [imgId], (err) => {
            if (err) {
                console.error('Error deleting image:', err.message);
                return res.status(500).json({ error: 'Error deleting image' });
            }

            res.status(200).json({ message: 'Image deleted successfully' });
        });
    });
});

// In apiEndpoints/saveRemoveImage.js
router.put('/update/:imgId', (req, res) => {
  const imgId = req.params.imgId;
  const { url, undercategories } = req.body;

  if (!imgId || !url || !undercategories || !Array.isArray(undercategories)) {
    return res.status(400).json({ error: 'Missing or invalid fields' });
  }

  // Update the image URL and other properties
  const sqlUpdateImage = `UPDATE Image SET img_url = ?, img_origin = ? WHERE img_id = ?`;
  db.run(sqlUpdateImage, [url, 'user-upload', imgId], function (err) {
    if (err) {
      console.error('Error updating image:', err.message);
      return res.status(500).json({ error: 'Error updating image' });
    }

    // Update image-undercategory mappings
    const deleteMappingsSql = `DELETE FROM Image_Undercateg WHERE img_id = ?`;
    db.run(deleteMappingsSql, [imgId], (err) => {
      if (err) {
        console.error('Error deleting old mappings:', err.message);
        return res.status(500).json({ error: 'Error updating image mappings' });
      }

      const mappingSql = `INSERT INTO Image_Undercateg (img_id, undercateg_id) VALUES (?, ?)`;
      const mappings = undercategories.map((undercategId) => [imgId, undercategId]);

      const stmt = db.prepare(mappingSql);

      let pending = mappings.length;
      if (pending === 0) {
        stmt.finalize();
        return res.status(200).json({ message: 'Image updated successfully' });
      }

      let hasError = false;
      mappings.forEach((mapping) => {
        stmt.run(mapping, (err) => {
          if (err) {
            console.error('Error inserting new mapping:', err.message);
            hasError = true;
          }

          pending--;

          if (pending === 0) {
            stmt.finalize((err) => {
              if (err) {
                console.error('Error finalizing statement:', err.message);
                return res.status(500).json({ error: 'Error finalizing statement' });
              }
              if (hasError) {
                return res.status(500).json({ error: 'Error updating image mappings' });
              }
              res.status(200).json({ message: 'Image updated successfully' });
            });
          }
        });
      });
    });
  });
});


module.exports = router;
