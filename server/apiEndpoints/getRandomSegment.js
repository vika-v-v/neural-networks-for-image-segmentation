// allows to show random segments of the image on the home-page

const express = require('express');
const router = express.Router();
const databaseOperations = require("../databaseOperations");

router.get('/:imageId', async (req, res) => {
  const { imageId } = req.params;

    try {
      const response = await databaseOperations.getRandomSegment(imageId);
      if (!response) {
        return res.status(404).json({ error: 'No segments found for this image' });
      }
      res.json(response);
    } catch (fetchError) {
      console.error('Error fetching image:', fetchError.message);
      res.status(500).send('Error fetching image');
    }
});

module.exports = router;
