const express = require("express");
const router = express.Router();

const callProcessImageWithModel = require("./callModelProcessingFactory");
const databaseOperations = require("../databaseOperations");

let currentlyProcessing = [];

router.get("/:neuralNetworkId/:imgId", async (req, res) => {
  try {
    const imgId = req.params.imgId;
    const neuralNetworkId = req.params.neuralNetworkId;

    // if already processing or processed, return
    if (
      (await databaseOperations.checkIfImageAlreadyProcessed(
        imgId,
        neuralNetworkId
      )) ||
      currentlyProcessing.includes(imgId)
    ) {
      const processedData = await databaseOperations.fetchProcessedData(
        imgId,
        neuralNetworkId
      );
      res.json(processedData);
      return;
    }

    const processedData = await callModelProcessingFactoryWithPreparations(
      neuralNetworkId,
      imgId
    );
    res.json(processedData);
  } catch (error) {
    console.error("Error processing or retrieving image data:", error);
    res.status(500).send("Error processing or retrieving image data");
  }
});

router.get("/force/:neuralNetworkId/:imgId", async (req, res) => {
  try {
    const imgId = req.params.imgId;
    const neuralNetworkId = req.params.neuralNetworkId;

    // if already processing or processed, delete and reprocess
    if (
      (await databaseOperations.checkIfImageAlreadyProcessed(imgId, neuralNetworkId)) ||
      currentlyProcessing.includes(imgId)
    ) {
      await databaseOperations.deleteProcessedImageData(neuralNetworkId, imgId);
    }

    const processedData = await callModelProcessingFactoryWithPreparations(
      neuralNetworkId,
      imgId
    );
    res.json(processedData);
  } catch (error) {
    console.error("Error processing or retrieving image data:", error);
    res.status(500).send("Error processing or retrieving image data");
  }
});

async function callModelProcessingFactoryWithPreparations(
  neuralNetworkId,
  imgId
) {
  currentlyProcessing.push(imgId);
  console.log(`Processing image ${imgId}...`);

  const imageUrl = await databaseOperations.fetchImageUrlById(imgId);
  const segments = await callProcessImageWithModel(neuralNetworkId, imageUrl);

  if (!Array.isArray(segments)) {
    console.error('Expected segments to be an array, but got:', segments);
    throw new Error('Invalid segments data received from model processing');
  }

  segments.forEach((segment) => {
    databaseOperations.saveSegmentToDatabase(
      segment.label,
      segment.color,
      segment.score,
      imgId,
      segment.base64,
      neuralNetworkId
    );
  });

  currentlyProcessing = currentlyProcessing.filter((id) => id !== imgId);

  // Fetch and return processed image data
  const processedData = await databaseOperations.fetchProcessedData(
    imgId,
    neuralNetworkId
  );
  return processedData;
}

module.exports = router;
