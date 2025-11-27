const express = require("express");
const router = express.Router();
const utilities = require("../utilities");
const regValidate = require("../utilities/account-validation");
const accountController = require("../controllers/accountController");

// Account management view
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccount)
);

// Login & Register views
router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Registration
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Login (FIXED)
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

/* **************************************
 * Account Management Routes
 * **************************************/

// Build account update screen
router.get(
  "/update/:account_id",
  utilities.checkLogin,
  utilities.checkAccountOwnership,
  utilities.handleErrors(accountController.buildAccountUpdate)
);

// Process account update
router.post(
  "/update",
  utilities.checkLogin,
  regValidate.accountUpdateRules(),
  regValidate.checkAccountUpdateData,
  utilities.handleErrors(accountController.updateAccount)
);

// Process password change
router.post(
  "/change-password",
  utilities.checkLogin,
  regValidate.passwordChangeRules(),
  regValidate.checkPasswordChangeData,
  utilities.handleErrors(accountController.changePassword)
);

// Logout
router.get(
  "/logout",
  utilities.handleErrors(accountController.accountLogout)
);

// Admin: view all accounts
router.get(
  "/manage-users",
  utilities.checkAdminAuth,
  utilities.handleErrors(accountController.buildAccountList)
);
/* ********************************************
 *  TEMPORARY LOGIN TEST ROUTE (ADD THIS HERE)
 * ********************************************/

router.post("/login", (req, res) => {
  res.status(200).send("login process");
});

module.exports = router;
