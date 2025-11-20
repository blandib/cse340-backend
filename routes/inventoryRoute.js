
// Needed Resources 
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/index");

// Classification
router.get("/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);

/* Item detail (FIXED FUNCTION NAME)
router.get("/detail/:inventoryId",
  utilities.handleErrors(invController.getInventoryItem)
);*/

router.get("/detail/:inventoryId", utilities.handleErrors(invController.getInventoryItem));

module.exports = router;
