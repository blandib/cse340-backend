// Needed Resources 
/*const express = require("express");
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
router.get(
  "/detail/:inv_id",
  utilities.handleErrors(invController.getInventoryItem)
);

// Management dashboard
router.get(
  "/",
  utilities.checkLogin,
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
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));


/* ***************************
 *  Edit Inventory View
 * ************************** */
/*router.get(
  "/edit/:inv_id",
  utilities.checkLogin, // optional: if you want only logged-in users to edit
  utilities.handleErrors(invController.editInventoryView)
);
/* ***************************
 *  Update Inventory Item
 * ************************** */
/*router.post(
  "/update",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.updateInventory) // <-- implement this
);
// Update inventory item
router.post(
  "/update/",
  invValidate.newInventoryRules(),
  invValidate.checkUpdateData,
  invController.updateInventory
);


module.exports = router;*/
// Needed Resources 
/*const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/index");
const invValidate = require("../utilities/inventory-validation");
//const { requireEmployeeOrAdmin } = require("../utilities/account-validation");
//const { requireEmployeeOrAdmin } = require("../utilities/account-validation");
// Classification
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);

router.get(
  "/detail/:inv_id",
  //requireEmployeeOrAdmin,
  utilities.handleErrors(invController.getInventoryItem)
);


// Management dashboard
router.get(
  "/",
  utilities.checkLogin,
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
   //requireEmployeeOrAdmin,
  utilities.handleErrors(invController.buildAddInventory)
);

// Process Inventory Form (Add)
router.post(
  "/add",
   //requireEmployeeOrAdmin,
  invValidate.newInventoryRules(),    // use newInventoryRules instead of inventoryRules
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.createInventory)
);

// Get Inventory JSON by Classification
router.get(
  "/getInventory/:classification_id", 
  utilities.handleErrors(invController.getInventoryJSON)
);

/* ***************************
 *  Edit Inventory View
 * ************************** */
/*router.get(
  "/edit/:inv_id",
  //requireEmployeeOrAdmin,
  utilities.checkLogin, // optional: restrict to logged-in users
  utilities.handleErrors(invController.editInventoryView)
);

/* ***************************
 *  Update Inventory Item
 * ************************** */

/*router.post(
  "/update",
  //requireEmployeeOrAdmin,
  invValidate.newInventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
);
// Delete confirmation page
router.get(
  "/delete/:inv_id",
  //requireEmployeeOrAdmin,
  utilities.checkLogin, // optional: restrict to logged-in users
  utilities.handleErrors(invController.buildDeleteView)
);

// Process deletion
router.post(
  "/delete",
  //requireEmployeeOrAdmin,
  utilities.handleErrors(invController.deleteInventory) // function will handle the deletion
);

module.exports = router;*/
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

router.get(
  "/detail/:inv_id",
  utilities.handleErrors(invController.getInventoryItem)
);

// Management dashboard
router.get(
  "/",
  utilities.checkLogin,
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

// Process Inventory Form (Add)
router.post(
  "/add",
  invValidate.newInventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.createInventory)
);

// Get Inventory JSON by Classification
router.get(
  "/getInventory/:classification_id", 
  utilities.handleErrors(invController.getInventoryJSON)
);

/* ***************************
 *  Edit Inventory View
 * ************************** */
router.get(
  "/edit/:inv_id",
  utilities.checkLogin,
  utilities.handleErrors(invController.editInventoryView)
);

/* ***************************
 *  Update Inventory Item
 * ************************** */
router.post(
  "/update",
  invValidate.newInventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
);

// Delete confirmation page
router.get(
  "/delete/:inv_id",
  utilities.checkLogin,
  utilities.handleErrors(invController.buildDeleteView)
);

// Process deletion
router.post(
  "/delete",
  utilities.handleErrors(invController.deleteInventory)
);

module.exports = router;

