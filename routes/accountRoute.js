/*
const express = require("express");
const router = express.Router();
const utilities = require("../utilities");
// Assuming 'regValidate' and 'accountValidate' are the same module, we use 'regValidate' consistently.
const regValidate = require("../utilities/account-validation");
const accountController = require("../controllers/accountController");
//const { requireLogin } = require("../utilities/account-auth"); // Note: 'requireLogin' is used below

// Login & Register views
router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Registration Process
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Login Process
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin) // Or accountController.accountLogin, ensure consistent usage
);

/* **************************************
 * Account Management Routes (Requires Login)
 * **************************************/

// Default account management route (requires login/admin checks)
/*router.get(
  "/",
  utilities.checkLogin, // Use consistent login check
  utilities.handleErrors(accountController.buildAccount) // Decide which build function is correct
);

// Account update form view
router.get(
  "/update/:account_id",
  utilities.checkLogin,
  utilities.checkAccountOwnership,
  utilities.handleErrors(accountController.buildAccountUpdate) // Ensure this is the correct controller function
);

// Process account update (Info)
router.post(
  "/update/info", // Changed path slightly to be specific
  utilities.checkLogin,
  regValidate.accountUpdateRules(), // Using regValidate consistently
  regValidate.checkAccountUpdateData,
  utilities.handleErrors(accountController.updateAccount) // Or updateAccountInfo
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
  utilities.handleErrors(accountController.accountLogout) // Use consistent logout function
);

// Admin: view all accounts
router.get(
  "/manage-users",
  utilities.checkAdminAuth,
  utilities.handleErrors(accountController.buildAccountList)
);

module.exports = router;*/
const express = require("express");
const router = express.Router();
const utilities = require("../utilities");
const regValidate = require("../utilities/account-validation");
const accountController = require("../controllers/accountController");

// Login & Register views
router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Registration Process
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Login Process
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

/* **************************************
 * Account Management Routes (Requires Login)
 * **************************************/

// Default account management route
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccount)
);

// Account update form view - NO OWNERSHIP CHECK
router.get(
  "/update/:account_id",
  utilities.checkLogin,  // ONLY login check
  utilities.handleErrors(accountController.buildAccountUpdate)
);

// Process account update - CHANGE PATH to match controller
router.post(
  "/update",  // Changed from "/update/info" to "/update"
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

module.exports = router;

