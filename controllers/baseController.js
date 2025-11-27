const utilities = require("../utilities/");
const baseController = {};

/* ****************************************
*  Deliver home view
* *************************************** */
baseController.buildHome = async function (req, res) {
  const nav = await utilities.getNav();
  // Set a flash message
  req.flash("notice", "This is a flash message.");
  res.render("index", {
    title: "Home",
    nav,
    message: req.flash("notice"), // pass message to view
  });
};

/* ****************************************
*  Deliver error view
* *************************************** */
baseController.handleError = async function (req, res) {
  const nav = await utilities.getNav();
  res.render("errors/error", {
    title: "Not Found",
    message: "Something went wrong!",
    nav,
  });
};

module.exports = baseController;