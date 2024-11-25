const express = require('express');
const router = express.Router();
const db = require('../db');
const util = require('util');

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


const dbRun = util.promisify(db.run.bind(db));
const dbAll = util.promisify(db.all.bind(db));

router.put('/:id', async (req, res) => {
  const categ_id = req.params.id;
  const { categ_name, order_in_list, undercategories } = req.body;

  if (!categ_name || !order_in_list || !Array.isArray(undercategories)) {
    return res.status(400).json({ error: 'Invalid input data' });
  }

  try {
    // Update the category name and order
    await dbRun(
      `UPDATE Category SET categ_name = ?, order_in_list = ? WHERE categ_id = ?`,
      [categ_name, order_in_list, categ_id]
    );

    // Retrieve existing undercategories
    const rows = await dbAll(`SELECT ucateg_id FROM Undercategory WHERE categ_id = ?`, [categ_id]);
    const existingUcategIds = rows.map(row => row.ucateg_id);

    // Build lists of undercategories to update, insert, and delete
    const undercategoriesToUpdate = undercategories.filter(uc => uc.id);
    const undercategoriesToInsert = undercategories.filter(uc => !uc.id);
    const undercategoryIdsFromClient = undercategoriesToUpdate.map(uc => uc.id);
    const undercategoriesToDelete = existingUcategIds.filter(id => !undercategoryIdsFromClient.includes(id));

    // Begin transaction
    await dbRun('BEGIN TRANSACTION');

    // Update undercategories
    for (const uc of undercategoriesToUpdate) {
      await dbRun(
        `UPDATE Undercategory SET ucateg_name = ?, order_in_list = ? WHERE ucateg_id = ?`,
        [uc.name, uc.order_in_list, uc.id]
      );
    }

    // Insert new undercategories
    if (undercategoriesToInsert.length > 0) {
      const placeholders = undercategoriesToInsert.map(() => '(?, ?, ?)').join(', ');
      const values = undercategoriesToInsert.flatMap((uc) => [
        uc.name,
        categ_id,
        uc.order_in_list,
      ]);

      await dbRun(
        `INSERT INTO Undercategory (ucateg_name, categ_id, order_in_list) VALUES ${placeholders}`,
        values
      );
    }

    // Delete undercategories
    if (undercategoriesToDelete.length > 0) {
      const placeholders = undercategoriesToDelete.map(() => '?').join(', ');
      await dbRun(
        `DELETE FROM Undercategory WHERE ucateg_id IN (${placeholders})`,
        undercategoriesToDelete
      );
    }

    // Commit transaction
    await dbRun('COMMIT');

    res.status(200).json({
      message: 'Category and undercategories updated successfully',
    });
  } catch (err) {
    console.error('Error updating category:', err.message);
    await dbRun('ROLLBACK');
    res.status(500).json({ error: 'Failed to update category and undercategories' });
  }
});

// Add this route
router.post('/update-images/:undercategId', (req, res) => {
  const undercategId = req.params.undercategId;
  const { imageIds } = req.body;

  if (!Array.isArray(imageIds)) {
    return res.status(400).json({ error: 'Invalid imageIds' });
  }

  db.run('BEGIN TRANSACTION', [], (err) => {
    if (err) {
      console.error('Error beginning transaction:', err.message);
      return res.status(500).json({ error: 'Failed to begin transaction' });
    }

    // Delete existing mappings
    const deleteSql = 'DELETE FROM Image_Undercateg WHERE undercateg_id = ?';
    db.run(deleteSql, [undercategId], (err) => {
      if (err) {
        console.error('Error deleting existing mappings:', err.message);
        db.run('ROLLBACK');
        return res.status(500).json({ error: 'Failed to delete existing mappings' });
      }

      // Insert new mappings
      if (imageIds.length === 0) {
        // No images to insert
        db.run('COMMIT', [], (err) => {
          if (err) {
            console.error('Error committing transaction:', err.message);
            return res.status(500).json({ error: 'Failed to commit transaction' });
          }
          res.status(200).json({ message: 'Undercategory images updated successfully' });
        });
      } else {
        const insertSql = 'INSERT INTO Image_Undercateg (img_id, undercateg_id) VALUES (?, ?)';
        const stmt = db.prepare(insertSql);
        let pending = imageIds.length;
        let hasError = false;

        imageIds.forEach((imgId) => {
          stmt.run([imgId, undercategId], (err) => {
            if (err) {
              console.error('Error inserting mapping:', err.message);
              hasError = true;
            }
            pending--;

            if (pending === 0) {
              stmt.finalize((err) => {
                if (err) {
                  console.error('Error finalizing statement:', err.message);
                  db.run('ROLLBACK');
                  return res.status(500).json({ error: 'Failed to finalize statement' });
                }

                if (hasError) {
                  db.run('ROLLBACK');
                  return res.status(500).json({ error: 'Failed to insert mappings' });
                }

                db.run('COMMIT', [], (err) => {
                  if (err) {
                    console.error('Error committing transaction:', err.message);
                    return res.status(500).json({ error: 'Failed to commit transaction' });
                  }
                  res.status(200).json({ message: 'Undercategory images updated successfully' });
                });
              });
            }
          });
        });
      }
    });
  });
});


module.exports = router;
