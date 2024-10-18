const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const dbPath = path.resolve(__dirname, "./mydatabase.db");

// Database connection
const db = new sqlite3.Database(
  "./mydatabase.db",
  sqlite3.OPEN_READWRITE,
  (err) => {
    if (err) {
      console.error("Database connection error:", err.message);
      return;
    }
    console.log("Connected to the database.");
  }
);

async function deleteProcessedImageData(neuralNetworkId, imgId) {
  return new Promise((resolve, reject) => {
    const query = `DELETE FROM Processed_Image WHERE img_id = ? AND nn_id = ?`;
    db.run(query, [imgId, neuralNetworkId], function (err) {
      if (err) {
        reject(err);
        return;
      }
      console.log(
        `Deleted ${this.changes} processed image data for imgId: ${imgId}`
      );
      resolve();
    });
  });
}

async function fetchProcessedData(imgId, nnId) {
  return new Promise((resolve, reject) => {
    const query = `SELECT lbl_name, lbl_color, score, pimg_base64 FROM Processed_Image WHERE img_id = ? AND nn_id = ?`;
    db.all(query, [imgId, nnId], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(
        rows.map((row) => ({
          label: row.lbl_name,
          color: row.lbl_color,
          score: row.score,
          base64: row.pimg_base64,
        }))
      );
    });
  });
}

// in this method, the labels are not taken into account, so if there is a data for at least one label but no data for the other once, the image will not be segmented once
async function checkIfImageAlreadyProcessed(imgId, nnId) {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM Processed_Image WHERE img_id = ? AND nn_id = ?`;
    db.get(query, [imgId, nnId], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(row ? true : false); // true if exists, false otherwise
    });
  });
}

async function saveSegmentToDatabase(
  label,
  labelColor,
  score,
  originalImgId,
  imageData,
  neuralNetworkId
) {
  const stmt = db.prepare(
    "INSERT INTO Processed_Image (lbl_name, lbl_color, score, pimg_base64, img_id, nn_id) VALUES (?, ?, ?, ?, ?, ?)"
  );

  stmt.run(
    label,
    labelColor,
    score,
    imageData,
    originalImgId,
    neuralNetworkId,
    function (err) {
      if (err) {
        console.error("Error saving processed image segment:", err.message);
      }
    }
  );
  stmt.finalize();
}

async function fetchImageUrlById(imgId) {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT img_url FROM Image WHERE img_id = ?",
      [imgId],
      (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        if (row) {
          resolve(row.img_url);
        } else {
          reject(new Error("Image not found"));
        }
      }
    );
  });
}

async function getRandomSegment(imgId) {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT pi.lbl_name, pi.lbl_color, pi.score, pi.pimg_base64, nn.nn_name
      FROM Processed_Image pi
      JOIN Neural_Network nn ON pi.nn_id = nn.nn_id
      WHERE pi.img_id = ?
      ORDER BY RANDOM()
      LIMIT 1
    `;
    db.get(query, [imgId], (err, row) => {
      if (err) {
        reject(err);
        return;
      }

      if(!row) {
        return;
      }
      
      resolve({
        label: row.lbl_name,
        color: row.lbl_color,
        score: row.score,
        base64: row.pimg_base64,
        nn_name: row.nn_name
      });
    });
  });
}

module.exports = {
    deleteProcessedImageData,
    fetchProcessedData,
    checkIfImageAlreadyProcessed,
    saveSegmentToDatabase,
    fetchImageUrlById,
    getRandomSegment
};
