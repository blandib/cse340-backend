
/*const pool = require("../database");

/* ***************************
 *  Get all classification data
 * ************************** */
/*async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
/*async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
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
}




module.exports = {
  getClassifications, 
  getInventoryByClassificationId,
  getItemById
  };*/
  const pool = require("../database/index");

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
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




module.exports = {
  getClassifications, 
  getInventoryByClassificationId,
  getItemById
  };