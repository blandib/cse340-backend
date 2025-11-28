
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
async function getInventoryByClassificationId(classification_id) {
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
}

/* ***************************
 *  Get a single inventory item by ID
 * ************************** */
async function getItemById(id) {
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
  nav,
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
      nav,
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


module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getItemById,
  insertClassification,
  insertInventory
};

