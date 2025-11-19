
// Needed Resources 
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/index");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/itemDetail/:inv_id", utilities.handleErrors(invController.getInventoryItem));
// Intentional error route for testing
router.get("/cause-error", (req, res, next) => {
  next(new Error("Intentional server error for testing."));
});

module.exports = router;