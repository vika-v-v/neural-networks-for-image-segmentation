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
    const response = await fetch('http://localhost:6000/nvidia/segformer-b3-finetuned-ade-512-512/segment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: imageUrl })
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const segments = await response.json();
    return segments.map(segment => ({
        label: segment.label,
        color: segment.color,
        score: segment.score,
        base64: segment.base64
    }));
}


module.exports = processImageWithModel;
