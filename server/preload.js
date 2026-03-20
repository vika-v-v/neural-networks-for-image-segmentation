// preload.js
// Pre-processes all images with all neural networks and saves results to the database.
// Run this script once (or whenever new images are added) so the page loads instantly.
//
// Usage (from the server/ directory):
//   node preload.js
//
// Requirements:
//   - The Python server (server.py) must be running on port 6000 before executing this script.

const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const databaseOperations = require('./databaseOperations');
const callProcessImageWithModel = require('./apiEndpoints/callModelProcessingFactory');

// How many images to process simultaneously.
// Network 1 (JS) and networks 2+3 (Python) run in separate processes,
// so they execute in parallel within each image slot.
const CONCURRENT_IMAGES = 3;

const db = new sqlite3.Database(
  path.join(__dirname, 'mydatabase.db'),
  sqlite3.OPEN_READONLY,
  (err) => {
    if (err) {
      console.error('Failed to open database:', err.message);
      process.exit(1);
    }
  }
);

function getAllImages() {
  return new Promise((resolve, reject) => {
    db.all('SELECT img_id, img_url FROM Image', [], (err, rows) => {
      if (err) reject(err); else resolve(rows);
    });
  });
}

function getAllNeuralNetworks() {
  return new Promise((resolve, reject) => {
    db.all('SELECT nn_id, nn_name FROM Neural_Network', [], (err, rows) => {
      if (err) reject(err); else resolve(rows);
    });
  });
}

async function processOne(image, network, stats) {
  const alreadyProcessed = await databaseOperations.checkIfImageAlreadyProcessed(
    image.img_id, network.nn_id
  );

  if (alreadyProcessed) {
    console.log(`[SKIP]  img=${image.img_id} nn=${network.nn_id} (${network.nn_name})`);
    stats.skipped++;
    return;
  }

  try {
    console.log(`[START] img=${image.img_id} nn=${network.nn_id} (${network.nn_name})`);
    const segments = await callProcessImageWithModel(network.nn_id, image.img_url);

    if (!Array.isArray(segments)) {
      throw new Error('Model returned invalid data (not an array)');
    }

    for (const segment of segments) {
      await databaseOperations.saveSegmentToDatabase(
        segment.label, segment.color, segment.score,
        image.img_id, segment.base64, network.nn_id
      );
    }

    console.log(`[DONE]  img=${image.img_id} nn=${network.nn_id} — ${segments.length} segments`);
    stats.processed++;
  } catch (err) {
    console.error(`[ERROR] img=${image.img_id} nn=${network.nn_id}: ${err.message}`);
    stats.failed++;
  }
}

// Run all networks for one image in parallel
async function processImage(image, networks, stats) {
  await Promise.all(networks.map(network => processOne(image, network, stats)));
}

// Process up to `concurrency` images simultaneously
async function runWithConcurrency(images, networks, concurrency, stats) {
  let index = 0;

  async function worker() {
    while (index < images.length) {
      const image = images[index++];
      await processImage(image, networks, stats);
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, images.length) }, worker);
  await Promise.all(workers);
}

async function preload() {
  const [images, networks] = await Promise.all([getAllImages(), getAllNeuralNetworks()]);

  console.log(`Found ${images.length} images and ${networks.length} neural networks.`);
  console.log(`Processing with ${CONCURRENT_IMAGES} concurrent image slots.\n`);

  const stats = { processed: 0, skipped: 0, failed: 0 };

  await runWithConcurrency(images, networks, CONCURRENT_IMAGES, stats);

  console.log('\n--- Preload complete ---');
  console.log(`  Processed : ${stats.processed}`);
  console.log(`  Skipped   : ${stats.skipped} (already cached)`);
  console.log(`  Failed    : ${stats.failed}`);

  db.close();
  process.exit(stats.failed > 0 ? 1 : 0);
}

preload().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
