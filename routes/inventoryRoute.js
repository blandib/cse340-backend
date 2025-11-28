// Needed Resources 
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/index");
const invValidate = require("../utilities/inventory-validation");

// Classification
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);

// Vehicle detail (ONLY ONE ROUTE)
router.get(
  "/detail/:inv_id",
  utilities.handleErrors(invController.buildById)
);

// Management dashboard
router.get(
  "/",
  utilities.handleErrors(invController.buildManagement)
);

// Add Classification Form
router.get(
  "/add-classification",
  utilities.handleErrors(invController.buildAddClassification)
);

// Process Classification Form
router.post(
  "/add-classification",
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.createClassification)
);

// Add Inventory Form
router.get(
  "/add",
  utilities.handleErrors(invController.buildAddInventory)
);

// Process Inventory Form
router.post(
  "/add",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.createInventory)
);

module.exports = router;
