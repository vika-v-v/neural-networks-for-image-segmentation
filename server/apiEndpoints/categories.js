const express = require('express');
const router = express.Router();
const db = require('../db');

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

router.post('/add-category', (req, res) => {
  const { categ_name, order_in_list, undercategories } = req.body;

  if (!categ_name || !order_in_list || !Array.isArray(undercategories)) {
    return res.status(400).json({ error: 'Invalid input data' });
  }

  db.run(
    `INSERT INTO Category (categ_name, order_in_list) VALUES (?, ?)`,
    [categ_name, order_in_list],
    function (err) {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: 'Failed to add category' });
      }

      const categ_id = this.lastID; // Get the ID of the inserted category

      // Insert undercategories if any
      if (undercategories.length > 0) {
        const placeholders = undercategories
          .map(() => '(?, ?, ?)')
          .join(', ');
        const values = undercategories.flatMap((uc) => [
          uc.name,
          categ_id,
          uc.order_in_list,
        ]);

        db.run(
          `INSERT INTO Undercategory (ucateg_name, categ_id, order_in_list) VALUES ${placeholders}`,
          values,
          (err) => {
            if (err) {
              console.error(err.message);
              return res
                .status(500)
                .json({ error: 'Failed to add undercategories' });
            }

            res.status(201).json({
              message: 'Category and undercategories added successfully',
              categ_id,
            });
          }
        );
      } else {
        res.status(201).json({
          message: 'Category added successfully',
          categ_id,
        });
      }
    }
  );
});

router.delete('/:id', (req, res) => {
  const categ_id = req.params.id;

  // Delete undercategories first
  db.run(`DELETE FROM Undercategory WHERE categ_id = ?`, [categ_id], (err) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Failed to delete undercategories' });
    }

    // Then delete the category
    db.run(`DELETE FROM Category WHERE categ_id = ?`, [categ_id], (err) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: 'Failed to delete category' });
      }

      res.status(200).json({ message: 'Category and its undercategories deleted successfully' });
    });
  });
});

// Update an existing category and its undercategories
router.put('/:id', (req, res) => {
  const categ_id = req.params.id;
  const { categ_name, order_in_list, undercategories } = req.body;

  if (!categ_name || !order_in_list || !Array.isArray(undercategories)) {
    return res.status(400).json({ error: 'Invalid input data' });
  }

  // Update the category name and order
  db.run(
    `UPDATE Category SET categ_name = ?, order_in_list = ? WHERE categ_id = ?`,
    [categ_name, order_in_list, categ_id],
    (err) => {
      if (err) {
        console.error('Error updating category:', err.message);
        return res.status(500).json({ error: 'Failed to update category' });
      }

      // Clear all existing undercategories for this category
      db.run(`DELETE FROM Undercategory WHERE categ_id = ?`, [categ_id], (err) => {
        if (err) {
          console.error('Error clearing undercategories:', err.message);
          return res
            .status(500)
            .json({ error: 'Failed to clear existing undercategories' });
        }

        // Insert updated undercategories
        if (undercategories.length > 0) {
          const placeholders = undercategories.map(() => '(?, ?, ?)').join(', ');
          const values = undercategories.flatMap((uc) => [
            uc.name,
            categ_id,
            uc.order_in_list,
          ]);

          db.run(
            `INSERT INTO Undercategory (ucateg_name, categ_id, order_in_list) VALUES ${placeholders}`,
            values,
            (err) => {
              if (err) {
                console.error('Error inserting updated undercategories:', err.message);
                return res
                  .status(500)
                  .json({ error: 'Failed to insert updated undercategories' });
              }

              res.status(200).json({
                message: 'Category and undercategories updated successfully',
              });
            }
          );
        } else {
          res.status(200).json({
            message: 'Category updated successfully without undercategories',
          });
        }
      });
    }
  );
});

module.exports = router;
