
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

async function buildAddInventory(req, res) {
  const nav = await utilities.getNav();

  // Get classifications from DB
  const classificationsData = await invModel.getClassifications();

  // Pass the rows array to utilities
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
  inv_description: ""  // <--- add this
});
}
async function createInventory(req, res) {
  const nav = await utilities.getNav();
  const {
    inv_make, inv_model, inv_year, inv_price,
    inv_miles, inv_color, inv_image, inv_thumbnail, classification_id, inv_description
  } = req.body;

  try {
    const success = await invModel.insertInventory({
      inv_make, 
      inv_model,
      inv_year: parseInt(inv_year),
      inv_price: parseFloat(inv_price),
      inv_miles: parseInt(inv_miles),
      inv_color,
      inv_image: inv_image || "/images/vehicles/no-image.png",
      inv_thumbnail: inv_thumbnail || "/images/vehicles/no-image-tn.png",
      classification_id: parseInt(classification_id),
      inv_description: inv_description || "No description provided"
    });

    if (success) {
      req.flash("notice", "Inventory item created successfully.");
      return res.redirect("/inv/");
    }
  } catch (err) {
    console.error("createInventory error:", err);
    req.flash("notice", "An error occurred while creating inventory item.");
    const classificationList = await utilities.buildClassificationList(parseInt(classification_id));
    return res.status(500).render("inventory/add-inventory", {
      title: "Add Inventory Item",
      nav,
      errors: null,
      message: req.flash("notice"),
      classificationList,
      inv_make, inv_model, inv_year, inv_price, inv_miles, inv_color, inv_image, inv_thumbnail, classification_id
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
