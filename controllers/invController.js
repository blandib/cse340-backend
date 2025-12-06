const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");
const { body, validationResult } = require("express-validator");
const invCont = {};

/* ============================
   Build Classification Page
=============================== */
async function buildByClassificationId(req, res, next) {
  try {
    const classificationId = parseInt(req.params.classificationId);

    if (isNaN(classificationId)) {
      const nav = await utilities.getNav();
      return res.status(400).render("inventory/classification", {
        title: "Invalid Classification",
        nav,
        grid: '<p class="notice">Classification does not exist.</p>',
      });
    }

    const data = await invModel.getInventoryByClassificationId(classificationId);
    const nav = await utilities.getNav();

    if (!data || data.length === 0) {
      return res.status(404).render("inventory/classification", {
        title: "No vehicles found",
        nav,
        grid: '<p class="notice">No vehicles in this category.</p>',
      });
    }

    const grid = await utilities.buildClassificationGrid(data);
    const className = data[0].classification_name;

    res.render("inventory/classification", {
      title: `${className} vehicles`,
      nav,
      grid,
    });
  } catch (error) {
    next(error);
  }
}

/* ============================
   Build Inventory Item Page
=============================== */

// Get a single inventory item detail page
async function getInventoryItem(req, res, next) {
  const inv_id = req.params.inv_id;

  const data = await invModel.getInventoryItemById(inv_id);

  if (!data) {
    req.flash("error", "Vehicle not found");
    return res.redirect("/inv");
  }

  res.render("inventory/detail", {
    title: data.inv_make + " " + data.inv_model,
    item: data,
    errors: null,
    message: req.flash("notice"),
  });
}

/* ============================
   Management Page
=============================== */
async function buildManagement(req, res) {
  const nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList();
   const messages = req.flash("notice");
  res.render("./inventory/management", {
  title: "Inventory Management",
  nav,
  classificationSelect, // <-- add this
  message: messages, //req.flash("notice"),
  
});

}
/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
async function getInventoryJSON(req, res, next) {
  const classification_id = parseInt(req.params.classification_id);
  try {
    const invData = await invModel.getInventoryByClassificationId(classification_id);
    if (invData[0]?.inv_id) {
      return res.json(invData);
    } else {
      next(new Error("No data returned"));
    }
  } catch (error) {
    next(error);
  }
}


/* ============================
   Add Classification Form
=============================== */
async function buildAddClassification(req, res) {
  const nav = await utilities.getNav();
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
    message: req.flash("notice"),
    classification_name: "",
  });
}

/* ============================
   Submit New Classification
=============================== */
async function createClassification(req, res) {
  const nav = await utilities.getNav();
  const { classification_name } = req.body;

  try {
    const result = await invModel.insertClassification(classification_name);

    if (result.rowCount > 0) {
      req.flash("notice", "Classification created successfully.");
      return res.redirect("/inv/");
    }

    req.flash("notice", "Failed to create classification.");
    res.status(500).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
      message: req.flash("notice"),
      classification_name,
    });
  } catch (err) {
    console.error("createClassification error:", err);
    req.flash("notice", "Error creating classification.");
    res.status(500).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
      message: req.flash("notice"),
      classification_name,
    });
  }
}
/* ============================
   Add Inventory Form
=============================== */
async function buildAddInventory(req, res) {
  try {
    const nav = await utilities.getNav();
    const classifications = await invModel.getClassifications();
    const classificationList = await utilities.buildClassificationList(classifications.rows);

    // Pass all expected variables to EJS
    res.render("inventory/add-inventory", {
      title: "Add Inventory Item",
      nav,
      errors: null,
      message: req.flash("notice"),
      classificationList,
      inv_make: "",
      inv_model: "",
      inv_year: "",
      inv_price: "",
      inv_miles: "",
      inv_color: "",
      inv_image: "/images/vehicles/no-image.png",
      inv_thumbnail: "/images/vehicles/no-image-tn.png",
      classification_id: "",
      inv_description: "", // MUST exist
    });
  } catch (err) {
    console.error("buildAddInventory error:", err);
    res.status(500).render("errors/error", {
      title: "Server Error",
      message: "Unable to load Add Inventory page.",
      errorDetails: err.message,
      nav: "",
    });
  }
}

/* ============================
   Submit Inventory Item
=============================== */
async function createInventory(req, res) {
  const nav = await utilities.getNav();

  await body("inv_make").trim().isLength({ min: 2 }).run(req);
  await body("inv_model").trim().isLength({ min: 2 }).run(req);
  await body("inv_year").isInt({ min: 1900, max: 2099 }).run(req);
  await body("inv_price").isFloat({ min: 0 }).run(req);
  await body("inv_miles").isInt({ min: 0 }).run(req);
  await body("inv_color").trim().isLength({ min: 3 }).run(req);
  await body("inv_image").trim().notEmpty().run(req);
  await body("inv_thumbnail").trim().notEmpty().run(req);
  await body("classification_id").isInt({ min: 1 }).run(req);
  await body("inv_description").trim().isLength({ min: 5 }).run(req);

  const errors = validationResult(req);
  const classifications = await invModel.getClassifications();
  const classificationList = await utilities.buildClassificationList(
    classifications.rows,
    req.body.classification_id
  );

  if (!errors.isEmpty()) {
    req.flash("notice", "Please correct the errors and try again.");
    return res.status(400).render("inventory/add-inventory", {
      title: "Add Inventory Item",
      nav,
      errors,
      message: req.flash("notice"),
      classificationList,
      ...req.body,
    });
  }

  try {
    const success = await invModel.insertInventory({
      ...req.body,
      inv_year: parseInt(req.body.inv_year),
      inv_price: parseFloat(req.body.inv_price),
      inv_miles: parseInt(req.body.inv_miles),
      classification_id: parseInt(req.body.classification_id),
    });

    if (success) {
      req.flash("notice", "Inventory item added successfully.");
      return res.redirect("/inv/");
    }
  } catch (err) {
    console.error("createInventory error:", err);
    req.flash("notice", "Error adding inventory item.");
  }

  res.status(500).render("inventory/add-inventory", {
    title: "Add Inventory Item",
    nav,
    errors: null,
    message: req.flash("notice"),
    classificationList,
    ...req.body,
  });
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
async function editInventoryView(req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id);
    const nav = await utilities.getNav();

    // Get inventory item data by ID
    const itemData = await invModel.getInventoryById(inv_id);

    if (!itemData) {
      return res.status(404).render("errors/error", {
        title: "Inventory Item Not Found",
        message: "The requested inventory item does not exist.",
        nav,
      });
    }

    // Build classification select with current classification selected
    const classificationList = await utilities.buildClassificationList(
      itemData.classification_id
    );

    const itemName = `${itemData.inv_make} ${itemData.inv_model}`;

    res.render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationList,           // <-- FIXED NAME
      errors: null,
      message: req.flash("notice"),
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_description: itemData.inv_description,
      inv_image: itemData.inv_image,
      inv_thumbnail: itemData.inv_thumbnail,
      inv_price: itemData.inv_price,
      inv_miles: itemData.inv_miles,
      inv_color: itemData.inv_color,
      classification_id: itemData.classification_id,
    });
  } catch (error) {
    next(error);
  }
}
/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(req, res, next) {  // Remove "invCont." prefix
  let nav = await utilities.getNav()
  const {
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
    classification_id,
  } = req.body;

  try {
    const updateResult = await invModel.updateInventory(
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
    );

    if (updateResult) {
      const itemName = updateResult.inv_make + " " + updateResult.inv_model;
      req.flash("notice", `The ${itemName} was successfully updated.`);
      return res.redirect("/inv/");
    } else {
      const classificationSelect = await utilities.buildClassificationList(classification_id);
      const itemName = `${inv_make} ${inv_model}`;
      req.flash("notice", "Sorry, the update failed.");
      return res.status(501).render("inventory/edit-inventory", {
        title: "Edit " + itemName,
        nav,
        classificationSelect,
        errors: null,
        ...req.body
      });
    }
  } catch (err) {
    next(err);
  }
}

//module.exports = invCont;

/********deleted view**************** */

// Build Delete Confirmation Page
async function buildDeleteView(req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  const nav = await utilities.getNav();
  const itemData = await invModel.getInventoryById(inv_id);

  if (!itemData) {
    return res.status(404).render("errors/error", {
      title: "Inventory Item Not Found",
      message: "The requested inventory item does not exist.",
      nav,
    });
  }

  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  const classificationList = await utilities.buildClassificationList(itemData.classification_id);

  res.render("inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    classificationList,
    errors: null,
    message: req.flash("notice"),
    ...itemData
  });
}

// Process Delete Inventory
async function deleteInventory(req, res, next) {
  const inv_id = parseInt(req.body.inv_id);

  try {
    const result = await invModel.deleteInventoryItem(inv_id); // Model function
    if (result) {
      req.flash("notice", "Inventory item deleted successfully.");
      return res.redirect("/inv/");
    } else {
      req.flash("notice", "Delete failed.");
      return res.redirect(`/inv/delete/${inv_id}`);
    }
  } catch (err) {
    next(err);
  }
}



module.exports = {
  buildByClassificationId,
  getInventoryItem,
  buildManagement,
  buildAddClassification,
  createClassification,
  buildAddInventory,
  createInventory,
  getInventoryJSON,
  editInventoryView,
  updateInventory, 
  buildDeleteView,
  deleteInventory,
   
};
