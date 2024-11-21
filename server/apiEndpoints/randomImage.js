const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // Dynamically import node-fetch
    const fetch = (await import('node-fetch')).default;

    const response = await fetch('https://thispersondoesnotexist.com');
    const imageBuffer = await response.buffer();
    const base64Image = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;
    res.send(base64Image);
  } catch (error) {
    console.error('Error fetching random image:', error.message);
    res.status(500).send('Error fetching random image');
  }
});

module.exports = router;
