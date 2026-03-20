// addHomepageImage.js
// One-time script: adds the homepage background image to the DB, processes it
// with all neural networks, and updates home-page.component.html with the new ID.
//
// Usage (from the server/ directory):
//   node addHomepageImage.js
//
// Requirements:
//   - Both servers must be running (node server.js AND python3 server.py)
//   - Angular dev server must be running (ng serve) so the image is accessible at localhost:4200

const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const sqlite3 = require('sqlite3').verbose();
const databaseOperations = require('./databaseOperations');
const callProcessImageWithModel = require('./apiEndpoints/callModelProcessingFactory');

const IMAGE_URL = 'http://localhost:4200/assets/homepage-segmented-image.png'; // stored in DB for frontend display
const IMAGE_PATH = path.join(
  __dirname,
  '../compare-face-segmentation/src/assets/homepage-segmented-image.png'
);
const TEMPLATE_PATH = path.join(
  __dirname,
  '../compare-face-segmentation/src/app/home-page/home-page.component.html'
);

const db = new sqlite3.Database(
  path.join(__dirname, 'mydatabase.db'),
  sqlite3.OPEN_READWRITE,
  (err) => {
    if (err) { console.error('Failed to open database:', err.message); process.exit(1); }
  }
);

function findExistingImage(url) {
  return new Promise((resolve, reject) => {
    db.get('SELECT img_id FROM Image WHERE img_url = ?', [url], (err, row) => {
      if (err) reject(err); else resolve(row ? row.img_id : null);
    });
  });
}

function insertImage(url) {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO Image (img_url, img_origin) VALUES (?, ?)',
      [url, 'homepage asset'],
      function (err) { if (err) reject(err); else resolve(this.lastID); }
    );
  });
}

function getAllNeuralNetworks() {
  return new Promise((resolve, reject) => {
    db.all('SELECT nn_id, nn_name FROM Neural_Network', [], (err, rows) => {
      if (err) reject(err); else resolve(rows);
    });
  });
}

function patchTemplate(imgId) {
  let html = fs.readFileSync(TEMPLATE_PATH, 'utf8');
  const updated = html.replace(/\[imageId\]="(\d+)"/, `[imageId]="${imgId}"`);
  if (html === updated) {
    console.log('Warning: could not find [imageId] in template to patch.');
    return;
  }
  fs.writeFileSync(TEMPLATE_PATH, updated, 'utf8');
  console.log(`Patched home-page.component.html with [imageId]="${imgId}"`);
}

async function run() {
  const networks = await getAllNeuralNetworks();

  // Reuse existing DB entry if the image was already added before
  let imgId = await findExistingImage(IMAGE_URL);
  if (imgId) {
    console.log(`Image already in DB with id=${imgId}`);
  } else {
    imgId = await insertImage(IMAGE_URL);
    console.log(`Inserted homepage image with id=${imgId}`);
  }

  // Resize to 1024px max — the original is 89MB which is too large for model inference.
  // Segmentation models work at ~512px resolution anyway.
  console.log('Resizing image for processing...');
  const resizedBuffer = await sharp(IMAGE_PATH)
    .resize(1024, 1024, { fit: 'inside' })
    .png()
    .toBuffer();
  const imageBase64 = resizedBuffer.toString('base64');
  console.log(`Resized to ${(resizedBuffer.length / 1024).toFixed(0)} KB\n`);

  // Process all networks in parallel
  console.log(`\nProcessing image ${imgId} with all ${networks.length} networks in parallel...\n`);

  await Promise.all(networks.map(async (network) => {
    const alreadyProcessed = await databaseOperations.checkIfImageAlreadyProcessed(imgId, network.nn_id);
    if (alreadyProcessed) {
      console.log(`[SKIP]  nn=${network.nn_id} (${network.nn_name}) — already cached`);
      return;
    }

    try {
      console.log(`[START] nn=${network.nn_id} (${network.nn_name})`);
      const segments = await callProcessImageWithModel(network.nn_id, imageBase64);
      if (!Array.isArray(segments)) throw new Error('Model returned invalid data');

      for (const segment of segments) {
        await databaseOperations.saveSegmentToDatabase(
          segment.label, segment.color, segment.score,
          imgId, segment.base64, network.nn_id
        );
      }
      console.log(`[DONE]  nn=${network.nn_id} — ${segments.length} segments saved`);
    } catch (err) {
      console.error(`[ERROR] nn=${network.nn_id}: ${err.message}`);
    }
  }));

  patchTemplate(imgId);
  console.log('\nDone. Restart the Angular dev server if it is already running.');

  db.close();
  process.exit(0);
}

run().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
