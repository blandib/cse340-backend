const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");
const { body, validationResult } = require("express-validator");

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
async function getInventoryItem(req, res) {
  const itemId = parseInt(req.params.inventoryId);
  const nav = await utilities.getNav();
  const inventoryItem = await invModel.getItemById(itemId);

  if (!inventoryItem) {
    return res.status(404).render("inventory/itemDetail", {
      title: "Item not found",
      nav,
      itemHTML: "<p>Vehicle not found.</p>",
    });
  }

  const itemHTML = utilities.buildItemHTML(inventoryItem);

  res.render("inventory/itemDetail", {
    title: `${inventoryItem.inv_make} ${inventoryItem.inv_model}`,
    nav,
    itemHTML,
  });
}

/* ============================
   Management Page
=============================== */
async function buildManagement(req, res) {
  const nav = await utilities.getNav();
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    message: req.flash("notice"),
  });
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
  const nav = await utilities.getNav();
  const classifications = await invModel.getClassifications();
  const classificationList = await utilities.buildClassificationList(classifications.rows);

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
    inv_description: "",
  });
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

module.exports = {
  buildByClassificationId,
  getInventoryItem,
  buildManagement,
  buildAddClassification,
  createClassification,
  buildAddInventory,
  createInventory,
};
