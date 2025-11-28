const { body, validationResult } = require("express-validator");
const utilities = require("../utilities");
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

function checkInventoryData(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash("notice", "Please correct the errors and try again.");
    return res.render("inventory/add-inventory", {
      title: "Add Inventory Item",
      nav: res.locals.nav || [],
      errors,
      message: req.flash("notice"),
      classifications: res.locals.classifications || [],
      inv_make: req.body.inv_make,
      inv_model: req.body.inv_model,
      inv_year: req.body.inv_year,
      inv_price: req.body.inv_price,
      inv_miles: req.body.inv_miles,
      inv_color: req.body.inv_color,
      classification_id: req.body.classification_id
    });
  }
  next();
}function inventoryRules() {
  return [
    body("inv_make").trim().isLength({ min: 2 }).withMessage("Make must be at least 2 characters."),
    body("inv_model").trim().isLength({ min: 2 }).withMessage("Model must be at least 2 characters."),
    body("inv_year").isInt({ min: 1900, max: 2099 }).withMessage("Enter a valid year."),
    body("inv_price").isFloat({ min: 0 }).withMessage("Price must be a positive number."),
    body("inv_miles").isInt({ min: 0 }).withMessage("Miles must be a non-negative integer."),
    body("inv_color").trim().isLength({ min: 3 }).withMessage("Color must be at least 3 characters."),
    body("inv_image").trim().isLength({ min: 5 }).withMessage("Provide an image path."),
    body("inv_thumbnail").trim().isLength({ min: 5 }).withMessage("Provide a thumbnail path."),
    body("classification_id").isInt({ min: 1 }).withMessage("Please select a classification.")
  ];
}
async function checkInventoryData(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList(req.body.classification_id || null);
    req.flash("notice", "Please correct the errors and try again.");
    return res.render("inventory/add-inventory", {
      title: "Add Inventory Item",
      //nav,
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
      classification_id: req.body.classification_id
    });
  }
  next();
}





module.exports = {
  classificationRules,
  checkClassificationData,
  inventoryRules,
  checkInventoryData
};