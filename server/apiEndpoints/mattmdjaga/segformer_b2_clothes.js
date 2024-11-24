const express = require('express');
const app = express();

app.use(express.json());


let fetch;
let pipeline, env;

(async () => {
  fetch = (await import("node-fetch")).default;
  const transformers = await import("@xenova/transformers");
  pipeline = transformers.pipeline;
  env = transformers.env;
  env.allowLocalModels = false;
})();

async function processImageWithModel(imageUrl) {
    try {
        const response = await fetch('http://localhost:6000/mattmdjaga/segformer_b2_clothes/segment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url: imageUrl })
        });

        const data = await response.json();

        console.log('Data received from Python backend:', data);

        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}

module.exports = processImageWithModel;
