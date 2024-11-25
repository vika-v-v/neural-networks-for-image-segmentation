// server/databaseInit.js

const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// Function to execute SQL from a file
function executeSqlFile(db, filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, sql) => {
      if (err) {
        return reject(`Error reading ${filePath}: ${err.message}`);
      }

      db.exec(sql, (err) => {
        if (err) {
          return reject(`Error executing ${filePath}: ${err.message}`);
        }
        console.log(`Executed ${path.basename(filePath)} successfully.`);
        resolve();
      });
    });
  });
}

// Connect to the SQLite database (it will be created if it doesn't exist)
const db = new sqlite3.Database('./server/mydatabase.db', async (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  }
  console.log('Connected to the mydatabase.db database.');

  try {
    // Define the order of SQL scripts to execute
    const sqlFiles = [
      'init/categories_and_nn-works.sql',
      'init/image.sql',
      'init/image_categ_and_segments.sql'
    ];

    // Execute each SQL script sequentially
    for (const file of sqlFiles) {
      const filePath = path.join(__dirname, file);
      await executeSqlFile(db, filePath);
    }

    console.log('Database initialized successfully with all tables.');
  } catch (error) {
    console.error(error);
  } finally {
    // Close the database connection
    db.close((err) => {
      if (err) {
        console.error('Error closing the database connection:', err.message);
      } else {
        console.log('Closed the database connection.');
      }
    });
  }
});
