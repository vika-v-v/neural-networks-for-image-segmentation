const express = require('express');
const router = express.Router();
const databaseOperations = require('../databaseOperations');

router.get('/:undercategoryId', async (req, res) => {
  try {
    const data = await databaseOperations.fetchProcessedDataByUndercategory(req.params.undercategoryId);
    res.json(data);
  } catch (err) {
    console.error('Error fetching batch processed data:', err.message);
    res.status(500).send('Error fetching batch processed data');
  }
});

module.exports = router;
