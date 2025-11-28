
const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

async function buildByClassificationId(req, res, next) {
  try {
    const classificationId = parseInt(req.params.classificationId);
    if (isNaN(classificationId)) {
      const nav = await utilities.getNav();
      const grid = '<p class="notice">The classification you requested does not exist.</p>';
      return res.status(400).render("inventory/classification", { title: "Invalid Classification", nav, grid });
    }

    const data = await invModel.getInventoryByClassificationId(classificationId);
    const nav = await utilities.getNav();
    const grid = await utilities.buildClassificationGrid(data);

    if (!data || data.length === 0) {
      return res.status(404).render("inventory/classification", { title: "No vehicles found", nav, grid });
    }

    const className = data[0].classification_name;
    res.render("inventory/classification", { title: `${className} vehicles`, nav, grid });
  } catch (error) {
    next(error);
  }
}

async function getInventoryItem(req, res, next) {
  const itemId = parseInt(req.params.inventoryId);
  const inventoryItem = await invModel.getItemById(itemId);

  if (!inventoryItem) {
    const nav = await utilities.getNav();
    return res.status(404).render("inventory/itemDetail", { title: "Item not found", nav, itemHTML: "<p>Vehicle not found.</p>" });
  }

  const itemHTML = utilities.buildItemHTML(inventoryItem);
  const nav = await utilities.getNav();

  res.render("inventory/itemDetail", { title: `${inventoryItem.inv_make} ${inventoryItem.inv_model}`, nav, itemHTML });
}

async function buildManagement(req, res) {
  const nav = await utilities.getNav();
  res.render("inventory/management", { title: "Inventory Management", nav, message: req.flash("notice") });
}

async function buildAddClassification(req, res) {
  const nav = await utilities.getNav();
  const flashArr = req.flash("notice") || [];
  const message = Array.isArray(flashArr) ? flashArr.join(" ") : flashArr || null;

  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
    message,
    classification_name: ""
  });
}

async function createClassification(req, res) {
  const nav = await utilities.getNav();
  const { classification_name } = req.body;

  try {
    const result = await invModel.insertClassification(classification_name);
    if (result && (result.rowCount > 0 || result.rows)) {
      req.flash("notice", "Classification created successfully.");
      return res.redirect("/inv/");
    } else {
      req.flash("notice", "Classification creation failed.");
      const flashArr = req.flash("notice") || [];
      const message = Array.isArray(flashArr) ? flashArr.join(" ") : flashArr || null;
      return res.status(500).render("inventory/add-classification", { title: "Add Classification", nav, errors: null, message, classification_name });
    }
  } catch (err) {
    console.error("createClassification error:", err);
    req.flash("notice", "An error occurred while creating classification.");
    const flashArr = req.flash("notice") || [];
    const message = Array.isArray(flashArr) ? flashArr.join(" ") : flashArr || null;
    return res.status(500).render("inventory/add-classification", { title: "Add Classification", nav, errors: null, message, classification_name });
  }
}

// Build Add Inventory Form
async function buildAddInventory(req, res) {
  const nav = await utilities.getNav();

  // Get classifications from DB
  const classificationsData = await invModel.getClassifications();
  const classificationList = await utilities.buildClassificationList(classificationsData.rows);

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
    inv_description: ""
  });
}

// Create Inventory Item with Server-side Validation
async function createInventory(req, res) {
  const nav = await utilities.getNav();

  // Validation rules
  await body("inv_make").trim().isLength({ min: 2 }).withMessage("Make must be at least 2 characters.").run(req);
  await body("inv_model").trim().isLength({ min: 2 }).withMessage("Model must be at least 2 characters.").run(req);
  await body("inv_year").isInt({ min: 1900, max: 2099 }).withMessage("Enter a valid year.").run(req);
  await body("inv_price").isFloat({ min: 0 }).withMessage("Price must be positive.").run(req);
  await body("inv_miles").isInt({ min: 0 }).withMessage("Miles must be non-negative.").run(req);
  await body("inv_color").trim().isLength({ min: 3 }).withMessage("Color must be at least 3 characters.").run(req);
  await body("inv_image").trim().notEmpty().withMessage("Provide an image path.").run(req);
  await body("inv_thumbnail").trim().notEmpty().withMessage("Provide a thumbnail path.").run(req);
  await body("classification_id").isInt({ min: 1 }).withMessage("Please select a classification.").run(req);
  await body("inv_description").trim().isLength({ min: 5 }).withMessage("Description must be at least 5 characters.").run(req);

  const errors = validationResult(req);
  const classificationList = await utilities.buildClassificationList(req.body.classification_id || null);

  if (!errors.isEmpty()) {
    req.flash("notice", "Please correct the errors and try again.");
    return res.status(400).render("inventory/add-inventory", {
      title: "Add Inventory Item",
      nav,
      errors,
      message: req.flash("notice"),
      classificationList,
      inv_make: req.body.inv_make,
      inv_model: req.body.inv_model,
      inv_year: req.body.inv_year,
      inv_price: req.body.inv_price,
      inv_miles: req.body.inv_miles,
      inv_color: req.body.inv_color,
      inv_image: req.body.inv_image,
      inv_thumbnail: req.body.inv_thumbnail,
      classification_id: req.body.classification_id,
      inv_description: req.body.inv_description
    });
  }

  // Insert into DB
  try {
    const success = await invModel.insertInventory({
      inv_make: req.body.inv_make,
      inv_model: req.body.inv_model,
      inv_year: parseInt(req.body.inv_year),
      inv_price: parseFloat(req.body.inv_price),
      inv_miles: parseInt(req.body.inv_miles),
      inv_color: req.body.inv_color,
      inv_image: req.body.inv_image || "/images/vehicles/no-image.png",
      inv_thumbnail: req.body.inv_thumbnail || "/images/vehicles/no-image-tn.png",
      classification_id: parseInt(req.body.classification_id),
      inv_description: req.body.inv_description
    });

    if (success) {
      req.flash("notice", "Inventory item created successfully.");
      return res.redirect("/inv/");
    }
  } catch (err) {
    console.error("createInventory error:", err);
    req.flash("notice", "An error occurred while creating inventory item.");
    return res.status(500).render("inventory/add-inventory", {
      title: "Add Inventory Item",
      nav,
      errors: null,
      message: req.flash("notice"),
      classificationList,
      inv_make: req.body.inv_make,
      inv_model: req.body.inv_model,
      inv_year: req.body.inv_year,
      inv_price: req.body.inv_price,
      inv_miles: req.body.inv_miles,
      inv_color: req.body.inv_color,
      inv_image: req.body.inv_image,
      inv_thumbnail: req.body.inv_thumbnail,
      classification_id: req.body.classification_id,
      inv_description: req.body.inv_description
    });
  }
}
/* ***************************
 *  Build vehicle detail page
 * ************************** */
async function buildById(req, res) {
  const nav = await utilities.getNav();
  const inv_id = parseInt(req.params.inv_id);

  try {
    const itemData = await invModel.getInventoryById(inv_id);

    if (!itemData.rows.length) {
      req.flash("notice", "Vehicle not found");
      return res.redirect("/inv");
    }

    const vehicle = itemData.rows[0];

    res.render("inventory/detail", {
      title: `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      vehicle,
      message: req.flash("notice")
    });

  } catch (error) {
    console.error("buildById error:", error);
    req.flash("notice", "Error loading vehicle details.");
    res.redirect("/inv");
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
  buildById
};
