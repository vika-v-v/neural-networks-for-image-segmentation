const express = require('express');
const router = express.Router();
const db = require('../db');

// New endpoint to get undercategory name and all images in it
router.get('/:undercategId', (req, res) => {
  const undercategId = req.params.undercategId;

  // SQL to get the undercategory name
  const sqlUndercategory = `SELECT ucateg_name FROM Undercategory WHERE ucateg_id = ?`;

  // SQL to get all images associated with the undercategory
  const sqlImages = `
    SELECT 
      i.img_id, i.img_url, i.img_origin
    FROM Image i
    INNER JOIN Image_Undercateg iu ON i.img_id = iu.img_id
    WHERE iu.undercateg_id = ?
  `;

  // Fetch the undercategory name
  db.get(sqlUndercategory, [undercategId], (err, undercategory) => {
    if (err) {
      console.error('Error fetching undercategory:', err.message);
      return res.status(500).json({ error: 'Error fetching undercategory' });
    }

    if (!undercategory) {
      return res.status(404).json({ error: 'Undercategory not found' });
    }

    // Fetch all images associated with the undercategory
    db.all(sqlImages, [undercategId], (err, images) => {
      if (err) {
        console.error('Error fetching images:', err.message);
        return res.status(500).json({ error: 'Error fetching images' });
      }

      res.json({
        undercategory: {
          id: undercategId,
          name: undercategory.ucateg_name,
          images: images
        }
      });
    });
  });
});

module.exports = router;
