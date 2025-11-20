
const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* =======================================
 * Build inventory by classification
 * ======================================= */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    // Validate classificationId
    const classificationId = parseInt(req.params.classificationId);

    if (isNaN(classificationId)) {
      // If invalid like "xyz"
      let nav = await utilities.getNav();
      return res.status(404).render("errors/error", {
        title: "Invalid Classification",
        nav,
        message: "The classification you are looking for does not exist."
      });
    }

    // Get vehicles
    const data = await invModel.getInventoryByClassificationId(classificationId);

    if (!data || data.length === 0) {
      let nav = await utilities.getNav();
      return res.status(404).render("errors/error", {
        title: "No Vehicles Found",
        nav,
        message: "No vehicles match this classification."
      });
    }

    // Build grid safely
    const grid = await utilities.buildClassificationGrid(data);
    const className = data[0].classification_name;
    let nav = await utilities.getNav();

    return res.render("inventory/classification", {
      title: className + " Vehicles",
      nav,
      grid
    });

  } catch (error) {
    next(error);
  }
};

/* =======================================
 * Build item detail page
 * ======================================= */
invCont.getItemDetail = async function(req, res, next) {
  try {
    const invId = parseInt(req.params.inventoryId);

    if (isNaN(invId)) {
      return res.status(404).render("errors/error", {
        message: "Invalid vehicle ID"
      });
    }

    const item = await invModel.getItemById(invId);

    if (!item) {
      return res.status(404).render("errors/error", {
        message: "Vehicle not found"
      });
    }

    let nav = await utilities.getNav();

    return res.render("inventory/itemDetail", {
      title: `${item.inv_make} ${item.inv_model}`,
      nav,
      item
    });

  } catch (error) {
    next(error);
  }
};

module.exports = invCont;
