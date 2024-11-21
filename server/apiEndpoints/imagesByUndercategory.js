const express = require('express');
const router = express.Router();
const db = require('../db');

const fetchImageAsBase64 = async (url) => {
  const fetch = (await import('node-fetch')).default; // Dynamic import of fetch
  const response = await fetch(url);
  const buffer = await response.buffer();
  return buffer.toString('base64');
};

// Define the GET endpoint to use undercategory ID
router.get('/:undercategoryId', async (req, res) => {
  const { undercategoryId } = req.params;

  // SQL query to select images based on undercategory ID
  const sql = `
    SELECT img.img_id, img.img_url, img.img_origin
    FROM Image img
    JOIN Image_Undercateg iuc ON img.img_id = iuc.img_id
    WHERE iuc.undercateg_id = ?;  
  `;

  // Execute the query with undercategoryId as parameter
  db.all(sql, [undercategoryId], async (err, rows) => {
    if (err) {
      console.error('Error querying the database:', err.message);
      res.status(500).send('Error querying the database');
      return;
    }

    // Fetch images as Base64 and add them to the rows
    try {
      const imagesWithBase64 = await Promise.all(rows.map(async (row) => {
        const imageBase64 = await fetchImageAsBase64(row.img_url);
        return { ...row, image: `data:image/jpeg;base64,${imageBase64}` };
      }));

      // Return the result as a JSON object including Base64 images
      res.json({ images: imagesWithBase64 });
    } catch (fetchError) {
      console.error('Error fetching images:', fetchError.message);
      res.status(500).send('Error fetching images');
    }
  });
});

module.exports = router;
