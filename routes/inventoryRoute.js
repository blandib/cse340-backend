
// Needed Resources 
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/index");
const invValidate = require("../utilities/inventory-validation");


// Classification
router.get("/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);

//Item detail (FIXED FUNCTION NAME)
router.get("/detail/:inventoryId",
  utilities.handleErrors(invController.getInventoryItem)
);

router.get("/detail/:inventoryId", utilities.handleErrors(invController.getInventoryItem));
// Management view (GET /inv/)
router.get("/",
  //utilities.checkLogin, // optional: restrict if needed
  utilities.handleErrors(invController.buildManagement)
);

// Deliver add classification view (GET /inv/add-classification)
router.get("/add-classification",
  //utilities.checkLogin,
  utilities.handleErrors(invController.buildAddClassification)
);

// Process add classification (POST /inv/add-classification)
router.post("/add-classification",
  //utilities.checkLogin,
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.createClassification)
);

// Deliver add inventory view (GET /inv/add)
router.get("/add",
  utilities.handleErrors(invController.buildAddInventory)
);

// Process add inventory (POST /inv/add)
router.post("/add",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.createInventory)
);
// View vehicle detail page
router.get("/detail/:inv_id", invController.buildById);




module.exports = router;
