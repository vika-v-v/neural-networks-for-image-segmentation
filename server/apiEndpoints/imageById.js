const express = require('express');
const router = express.Router();
const databaseOperations = require("../databaseOperations");

router.get('/:imageId', async (req, res) => {
  const { imageId } = req.params;

    try {
      const image = await databaseOperations.fetchImageUrlById(imageId);
      // Return the result as a JSON object including Base64 images
      res.json({ image: image });
    } catch (fetchError) {
      console.error('Error fetching image:', fetchError.message);
      res.status(500).send('Error fetching image');
    }
});

module.exports = router;
