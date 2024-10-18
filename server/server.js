const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sharp = require('sharp'); // For image processing
const app = express();

const categoriesApi = require('./apiEndpoints/categories');
const imagesByCategoryRouter = require('./apiEndpoints/imagesByCategory');
const imagesByUndercategoryRouter = require('./apiEndpoints/imagesByUndercategory');
const neuralNetworksRouter = require('./apiEndpoints/neuralNetworks')
const processImage = require('./apiEndpoints/processImage');
const imageByIdRouter = require('./apiEndpoints/imageById');
const getRandomSegment = require('./apiEndpoints/getRandomSegment');

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

app.use('/categories', categoriesApi);
app.use('/imagesByCategory', imagesByCategoryRouter);
app.use('/imagesByUndercategory', imagesByUndercategoryRouter);
app.use('/getProcessedImageData', processImage);
app.use('/neuralNetworks', neuralNetworksRouter);
app.use('/imageById', imageByIdRouter);
app.use('/getRandomSegment', getRandomSegment);


let pipeline, env, fetch;

(async () => {
  fetch = (await import('node-fetch')).default;
  const transformers = await import('@xenova/transformers');
  pipeline = transformers.pipeline;
  env = transformers.env;

  env.allowLocalModels = false;
})();

const port = 3000;
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
