const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

const categoriesApi = require('./apiEndpoints/categories');
const imagesByCategoryRouter = require('./apiEndpoints/imagesByCategory');
const imagesByUndercategoryRouter = require('./apiEndpoints/imagesByUndercategory');
const neuralNetworksRouter = require('./apiEndpoints/neuralNetworks')
const processImage = require('./apiEndpoints/processImage');
const imageByIdRouter = require('./apiEndpoints/imageById');
const getRandomSegment = require('./apiEndpoints/getRandomSegment');
const saveRemoveImage = require('./apiEndpoints/saveRemoveGetImages');
const randomImage = require('./apiEndpoints/randomImage');
const undercategories = require('./apiEndpoints/undercategories');

app.use(bodyParser.json({ limit: '1000mb' })); // Adjust the limit as needed
app.use(bodyParser.urlencoded({ limit: '1000mb', extended: true }));
app.use(cors());
app.use(express.json());

app.use('/categories', categoriesApi);
app.use('/undercategories', undercategories);
app.use('/imagesByCategory', imagesByCategoryRouter);
app.use('/imagesByUndercategory', imagesByUndercategoryRouter);
app.use('/getProcessedImageData', processImage);
app.use('/neuralNetworks', neuralNetworksRouter);
app.use('/imageById', imageByIdRouter);
app.use('/getRandomSegment', getRandomSegment);
app.use('/images', saveRemoveImage);
app.use('/random-image', randomImage);


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
