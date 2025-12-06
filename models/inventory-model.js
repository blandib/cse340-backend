
const pool = require("../database");

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name");
}

/* ***************************
 *  Get all inventory items by classification_id
 * ************************** */
/*async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getInventoryByClassificationId error:", error);
  }
}*/
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT 
          i.inv_id, 
          i.inv_make, 
          i.inv_model, 
          i.inv_year, 
          i.inv_price, 
          i.inv_miles, 
          i.inv_color, 
          i.inv_image, 
          i.inv_thumbnail, 
          i.inv_description,
          i.classification_id,
          c.classification_name
       FROM public.inventory AS i
       JOIN public.classification AS c
       ON i.classification_id = c.classification_id
       WHERE i.classification_id = $1
       ORDER BY i.inv_make`,
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getInventoryByClassificationId error:", error);
  }
}


/* ***************************
 *  Get a single inventory item by ID
 * ************************** */
/*async function getItemById(id) {
  try {
    const sql = `
      SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.inv_id = $1
    `;
    const result = await pool.query(sql, [id]);
    return result.rows[0];
  } catch (error) {
    console.error("getItemById error:", error);
    throw new Error("Database error retrieving inventory item.");
  }
}*/
async function getInventoryById(id) {
  try {
    const sql = `
      SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.inv_id = $1
    `;
    const result = await pool.query(sql, [id]);
    return result.rows[0];
  } catch (error) {
    console.error("getInventoryById error:", error);
    throw new Error("Database error retrieving inventory item.");
  }
}


/* ***************************
 *  Insert a new classification
 * ************************** */
async function insertClassification(classification_name) {
  try {
    const sql = `
      INSERT INTO public.classification (classification_name)
      VALUES ($1)
      RETURNING *
    `;
    const result = await pool.query(sql, [classification_name]);
    return result;
  } catch (error) {
    console.error("insertClassification error:", error);
    throw error;
  }
}

/* ***************************
 *  Insert a new inventory item
 * ************************** */
async function insertInventory({
  
  inv_make,
  inv_model,
  inv_year,
  inv_price,
  inv_miles,
  inv_color,
  inv_image,
  inv_thumbnail,
  inv_description,
  classification_id
}) {
  try {
    const sql = `
      INSERT INTO public.inventory
      (inv_make, inv_model, inv_year, inv_price, inv_miles,
       inv_color, inv_image, inv_thumbnail, inv_description, classification_id)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *
    `;
    const result = await pool.query(sql, [
      
      inv_make,
      inv_model,
      inv_year,
      inv_price,
      inv_miles,
      inv_color,
      inv_image,
      inv_thumbnail,
      inv_description,
      classification_id
    ]);

    return result.rowCount > 0;
  } catch (error) {
    console.error("insertInventory error:", error);
    throw error;
  }
}


/*module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getItemById,
  insertClassification,
  insertInventory,
  getInventoryById, 
};*/
/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
  inv_id,
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color,
  classification_id
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *";

    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
      inv_id,
    ]);

    return data.rows[0];
  } catch (error) {
    console.error("model error: " + error);
  }
}
/* ***************************
 *  Delete Inventory Item
 * ************************** */
async function deleteInventoryItem(inv_id) {
  try {
    const sql = "DELETE FROM inventory WHERE inv_id = $1";
    const data = await pool.query(sql, [inv_id]);
    return data.rowCount;
  } catch (error) {
    console.error("Delete Inventory Error:", error);
    throw new Error("Delete Inventory Error");
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryById, // ✔ correct
  insertClassification,
  insertInventory,
  updateInventory,
  deleteInventoryItem,
};


