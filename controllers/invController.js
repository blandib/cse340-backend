
const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");


const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
 
  let nav = await utilities.getNav();
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    
  });
}

/* ***************************
 *  Build inventory item detail view
 * ************************** */

invCont.getInventoryItem = async function (req, res, next) {
  try {
    const itemId = req.params.id;
    const inventoryItem = await inventoryModel.getItemById(itemId);

    if (!inventoryItem) {
      const error = new Error("Item not found");
      error.status = 404;
      return next(error);
    }

    const itemHTML = utilities.buildItemHTML(inventoryItem);
    const nav = await utilities.getNav();

    res.render('inventory/itemDetail', {
      title: `${inventoryItem.inv_make} ${inventoryItem.inv_model}`,
      nav,
      itemHTML
    });
  } catch (error) {
    next(error);
  }
};


  module.exports = invCont;
  