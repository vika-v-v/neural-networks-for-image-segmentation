const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./mydatabase.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }
});

router.get('/', (req, res) => {
  // Include IDs in the SELECT clause
  const sql = `
    SELECT 
      c.categ_id, c.categ_name, 
      uc.ucateg_id, uc.ucateg_name
    FROM Category c
    LEFT JOIN Undercategory uc ON c.categ_id = uc.categ_id 
    ORDER BY c.order_in_list, uc.order_in_list;
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Error querying the database');
      return;
    }

    // Initialize an object to hold the formatted categories and undercategories
    const categories = {};

    // Aggregate categories and undercategories, including their IDs
    rows.forEach(row => {
      // Check if the category has already been added
      if (!categories[row.categ_id]) {
        categories[row.categ_id] = {
          name: row.categ_name,
          undercategories: [] // Initialize an empty array for undercategories
        };
      }

      // Only add undercategories if they exist (ucateg_id will be null if not)
      if (row.ucateg_id) {
        categories[row.categ_id].undercategories.push({
          id: row.ucateg_id,
          name: row.ucateg_name
        });
      }
    });

    // Convert the categories object to an array to match the desired output format
    const categoriesArray = Object.keys(categories).map(key => ({
      id: key,
      name: categories[key].name,
      undercategories: categories[key].undercategories
    }));

    // Send the response
    res.json({ categories: categoriesArray });
  });
});

module.exports = router;
