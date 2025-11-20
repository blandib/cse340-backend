const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 * Build inventory by classification safely
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    // Convert ID to integer
    const classificationId = parseInt(req.params.classificationId);

    // Validate ID
    if (isNaN(classificationId)) {
      const nav = await utilities.getNav();
      const grid = '<p class="notice">The classification you requested does not exist.</p>';
      return res.status(400).render("./inventory/classification", {
        title: "Invalid Classification",
        nav,
        grid
      });
    }

    // Fetch vehicles for this classification
    const data = await invModel.getInventoryByClassificationId(classificationId);

    // Get navigation
    const nav = await utilities.getNav();

    // Build grid
    const grid = await utilities.buildClassificationGrid(data);

    // Handle empty results
    if (!data || data.length === 0) {
      return res.status(404).render("./inventory/classification", {
        title: "No vehicles found",
        nav,
        grid
      });
    }

    // Render normally
    const className = data[0].classification_name;
    res.render("./inventory/classification", {
      title: `${className} vehicles`,
      nav,
      grid
    });

  } catch (error) {
    next(error);
  }
};

/* ***************************
 * Build inventory item detail
 * ************************** */
/*invCont.getInventoryItem = async function (req, res, next) {
  try {
    const itemId = parseInt(req.params.inventoryId);

    if (isNaN(itemId)) {
      const nav = await utilities.getNav();
      return res.status(400).render('inventory/itemDetail', {
        title: "Invalid Vehicle",
        nav,
        itemHTML: "<p class='notice'>Invalid vehicle ID.</p>"
      });
    }

    const inventoryItem = await invModel.getItemById(itemId);

    if (!inventoryItem) {
      const nav = await utilities.getNav();
      return res.status(404).render('inventory/itemDetail', {
        title: "Vehicle not found",
        nav,
        itemHTML: "<p class='notice'>Vehicle not found.</p>"
      });
    }

    const nav = await utilities.getNav();
    const itemHTML = utilities.buildItemHTML(inventoryItem);

    res.render("inventory/itemDetail", {
      title: `${inventoryItem.inv_make} ${inventoryItem.inv_model}`,
      nav,
      itemHTML
    });

  } catch (error) {
    next(error);
  }
};*/
invCont.getInventoryItem = async function (req, res, next) {
  const itemId = parseInt(req.params.inventoryId); // must match route
  const inventoryItem = await invModel.getItemById(itemId);

  if (!inventoryItem) {
    const nav = await utilities.getNav();
    return res.status(404).render("inventory/itemDetail", {
      title: "Item not found",
      nav,
      itemHTML: "<p>Vehicle not found.</p>"
    });
  }

  const itemHTML = utilities.buildItemHTML(inventoryItem);
  const nav = await utilities.getNav();

  res.render("inventory/itemDetail", {
    title: `${inventoryItem.inv_make} ${inventoryItem.inv_model}`,
    nav,
    itemHTML
  });
};


module.exports = invCont;
