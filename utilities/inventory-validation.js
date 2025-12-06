/*const { body, validationResult } = require("express-validator");
const utilities = require("../utilities");
const validate = {};

function classificationRules() {
  return [
    body("classification_name")
      .trim()
      .isLength({ min: 3, max: 50 }).withMessage("Classification name must be 3–50 characters.")
      .matches(/^[A-Za-z][A-Za-z0-9_-]{2,49}$/).withMessage("Use letters, numbers, _ or -, starting with a letter.")
  ];
}

function checkClassificationData(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash("notice", "Please correct the errors and try again.");
    return res.render("inventory/add-classification", {
      title: "Add Classification",
      nav: res.locals.nav || [],
      errors,
      message: req.flash("notice"),
      classification_name: req.body.classification_name
    });
  }
  next();
}

function inventoryRules() {
  return [
    body("inv_make").trim().isLength({ min: 2 }).withMessage("Make must be at least 2 characters."),
    body("inv_model").trim().isLength({ min: 2 }).withMessage("Model must be at least 2 characters."),
    body("inv_year").isInt({ min: 1900, max: 2099 }).withMessage("Enter a valid year."),
    body("inv_price").isFloat({ min: 0 }).withMessage("Price must be a positive number."),
    body("inv_miles").isInt({ min: 0 }).withMessage("Miles must be a non-negative integer."),
    body("inv_color").trim().isLength({ min: 3 }).withMessage("Color must be at least 3 characters."),
    body("classification_id").isInt({ min: 1 }).withMessage("Please select a classification.")
  ];
}

async function checkInventoryData(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    const classifications = await invModel.getClassifications();
    const classificationList = await utilities.buildClassificationList(
      classifications.rows,
      req.body.classification_id
    );

    req.flash("notice", "Please correct the errors and try again.");

    return res.render("inventory/add-inventory", {
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
      inv_description: req.body.inv_description,  // <-- FIX
    });
  }

  next();
}

/*  **********************************
 *  Check data and return errors to Edit Inventory View
 * ********************************* */
/*validate.checkUpdateData = async (req, res, next) => {
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

  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList(
      classification_id
    );

    const itemName = `${inv_make} ${inv_model}`;

    return res.status(400).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      errors,
      message: req.flash("notice"),
      classificationList,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
  }
  next();
};





module.exports = {
  classificationRules,
  checkClassificationData,
  inventoryRules,
  checkInventoryData,
  validate
};*/
const { body, validationResult } = require("express-validator");
const utilities = require("../utilities");
const invModel = require("../models/inventory-model"); // Needed for classification list

// Keep existing validate object
const validate = {};

/* **************************************
 *   Classification Rules
 *************************************** */
validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .isLength({ min: 3, max: 50 })
      .withMessage("Classification name must be 3–50 characters.")
      .matches(/^[A-Za-z][A-Za-z0-9_-]{2,49}$/)
      .withMessage("Use letters, numbers, _ or -, starting with a letter."),
  ];
};

validate.checkClassificationData = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash("notice", "Please correct the errors and try again.");
    return res.render("inventory/add-classification", {
      title: "Add Classification",
      nav: res.locals.nav || [],
      errors,
      message: req.flash("notice"),
      classification_name: req.body.classification_name,
    });
  }
  next();
};

/* **************************************
 *   Inventory Rules for Adding
 *************************************** */
validate.newInventoryRules = () => {
  return [
    body("inv_make").trim().isLength({ min: 2 }).withMessage("Make must be at least 2 characters."),
    body("inv_model").trim().isLength({ min: 2 }).withMessage("Model must be at least 2 characters."),
    body("inv_year").isInt({ min: 1900, max: 2099 }).withMessage("Enter a valid year."),
    body("inv_price").isFloat({ min: 0 }).withMessage("Price must be a positive number."),
    body("inv_miles").isInt({ min: 0 }).withMessage("Miles must be a non-negative integer."),
    body("inv_color").trim().isLength({ min: 3 }).withMessage("Color must be at least 3 characters."),
    body("classification_id").isInt({ min: 1 }).withMessage("Please select a classification."),
    body("inv_description").trim().isLength({ min: 5 }).withMessage("Description must be at least 5 characters."),
  ];
};

/* **************************************
 *   Check Add Inventory Data
 *************************************** */
validate.checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    const classifications = await invModel.getClassifications();
    const classificationList = await utilities.buildClassificationList(
      classifications.rows,
      req.body.classification_id
    );

    req.flash("notice", "Please correct the errors and try again.");

    return res.render("inventory/add-inventory", {
      title: "Add Inventory Item",
      nav,
      errors,
      message: req.flash("notice"),
      classificationList,
      ...req.body, // keeps form sticky
    });
  }

  next();
};

/* **************************************
 *   Check Update Inventory Data
 *************************************** */
validate.checkUpdateData = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList(req.body.classification_id);

    const itemName = `${req.body.inv_make} ${req.body.inv_model}`;

    return res.status(400).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      errors,
      message: req.flash("notice"),
      classificationList,
      ...req.body, // keeps form sticky
    });
  }

  next();
};

// Export everything together
module.exports = validate;
