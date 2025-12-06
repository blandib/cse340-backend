/*const bcrypt = require("bcryptjs");
const utilities = require("../utilities");
const accountModel = require("../models/account-model");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { validationResult } = require("express-validator");

/* ****************************************
 *  Deliver login view
 * *************************************** */
/*async function buildLogin(req, res, next) {
  const nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    message: req.flash("notice"),
  });
}

/* ****************************************
 *  Deliver registration view
 * *************************************** */
/*async function buildRegister(req, res, next) {
  const nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
    message: req.flash("notice"),
  });
}

/* ****************************************
 *  Process Registration
 * *************************************** */
/*async function registerAccount(req, res) {
  const nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(account_password, 10);

    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    );

    if (regResult) {
      req.flash("notice", `Congratulations, you're registered ${account_firstname}. Please log in.`);
      return res.status(201).render("account/login", { title: "Login", nav, message: req.flash("notice") });
    } else {
      req.flash("notice", "Sorry, the registration failed.");
      return res.status(501).render("account/register", { title: "Register", nav, message: req.flash("notice") });
    }
  } catch (error) {
    console.error("Registration error:", error);
    req.flash("notice", "Sorry, there was an error processing your registration.");
    return res.status(500).render("account/register", { title: "Register", nav, message: req.flash("notice") });
  }
}

/* ****************************************
 *  Process Login
 * *************************************** */
/*async function accountLogin(req, res) {
  const nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);

  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    return res.status(400).render("account/login", { title: "Login", nav, errors: null, account_email });
  }

  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });

      res.cookie("jwt", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 3600 * 1000,
      });

      return res.redirect("/account/");
    } else {
      req.flash("notice", "Please check your credentials and try again.");
      return res.status(400).render("account/login", { title: "Login", nav, errors: null, account_email });
    }
  } catch (error) {
    console.error("Login error:", error);
    req.flash("notice", "An unexpected error occurred.");
    return res.status(500).render("account/login", { title: "Login", nav, errors: null, account_email });
  }
}
async function buildAccountUpdate(req, res, next) {
  const account_id = parseInt(req.params.account_id);
  const accountData = await accountModel.getAccountById(account_id);

  if (!accountData) {
    req.flash("notice", "Account not found.");
    return res.redirect("/account/");
  }

  const nav = await utilities.getNav();
  res.render("account/update", {
    title: "Edit Account",
    nav,
    errors: null,
    accountData,
  });
}

/* ****************************************
 *  Deliver account management view
 * *************************************** */
/*async function buildAccount(req, res, next) {
  const nav = await utilities.getNav();

  // Get flash messages safely as arrays
  const messages = req.flash("notice") || [];
  const errors = req.flash("error") || [];

  // Get name from JWT
  let account_firstname = "User";

  try {
    const token = req.cookies.jwt;
    if (token) {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      account_firstname = decoded.account_firstname;
    }
  } catch (err) {
    console.error("JWT decode error:", err);
  }

  res.render("account/account-management", {
    title: "Account Management",
    nav,
    messages,        // <-- important
    errors,          // <-- important
    account_firstname,
  });
}

/* ****************************************
 *  Process password change
 * *************************************** */
/*async function changePassword(req, res, next) {
  const nav = await utilities.getNav();
  const { account_password, account_id } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("account/update", { title: "Edit Account", nav, errors, accountData: res.locals.accountData });
  }

  try {
    const hashedPassword = await bcrypt.hash(account_password, 10);
    const updateResult = await accountModel.updatePassword(hashedPassword, account_id);

    if (updateResult) {
      req.flash("notice", "Password updated successfully.");
      return res.redirect("/account/");
    } else {
      req.flash("notice", "Failed to change password. Please try again.");
      return res.render("account/update", { title: "Edit Account", nav, errors: null, accountData: res.locals.accountData });
    }
  } catch (error) {
    console.error("Error changing password:", error);
    req.flash("notice", "An error occurred during password change.");
    return res.render("account/update", { title: "Edit Account", nav, errors: null, accountData: res.locals.accountData });
  }
}

/* ****************************************
 *  Logout
 * *************************************** */
/*async function accountLogout(req, res, next) {
  res.clearCookie("jwt");
  req.flash("notice", "You have been logged out.");
  return res.redirect("/");
}

/* ****************************************
 *  Build account list
 * *************************************** */
/*async function buildAccountList(req, res, next) {
  const nav = await utilities.getNav();
  try {
    const accountList = await accountModel.getAllAccounts();
    res.render("account/account-list", { title: "All User Accounts", nav, errors: null, accountList });
  } catch (error) {
    console.error("buildAccountList controller error:", error);
    req.flash("notice", "Failed to load user accounts.");
    res.redirect("/account/");
  }
}

async function registerAccount(req, res) {
  const nav = await utilities.getNav();

  // Check validation errors
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render("account/register", {
      title: "Register",
      nav,
      errors: errors.array(),
      locals: {
        account_firstname: req.body.account_firstname,
        account_lastname: req.body.account_lastname,
        account_email: req.body.account_email
      },
      message: null,
    });
  }

  // Extract form data
  const { 
    account_firstname, 
    account_lastname, 
    account_email, 
    account_password 
  } = req.body;

  // -------------------------------
  // 🔒 HASH THE PASSWORD
  // -------------------------------
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(account_password, 10);
  } catch (error) {
    req.flash("notice", "Sorry, there was an error processing the registration.");
    return res.status(500).render("account/register", {
      title: "Register",
      nav,
      errors: null,
      locals: {
        account_firstname,
        account_lastname,
        account_email
      }
    });
  }

  // -------------------------------
  // 📌 REGISTER THE ACCOUNT USING HASHED PASSWORD
  // -------------------------------
  try {
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword   // ⬅️ IMPORTANT: using hashed password
    );

    if (regResult) {
      req.flash("notice", `Congratulations, you're registered ${account_firstname}. Please log in.`);
      return res.status(201).render("account/login", {
        title: "Login",
        nav,
        message: req.flash("notice")
      });
    } else {
      req.flash("notice", "Sorry, the registration failed.");
      return res.status(501).render("account/register", {
        title: "Register",
        nav,
        errors: null,
        locals: {
          account_firstname,
          account_lastname,
          account_email
        },
        message: req.flash("notice")
      });
    }
  } catch (error) {
    console.error("Registration error:", error);
    req.flash("notice", "Sorry, there was an error processing your registration.");
    return res.status(500).render("account/register", {
      title: "Register",
      nav,
      errors: null,
      locals: {
        account_firstname,
        account_lastname,
        account_email
      },
      message: req.flash("notice")
    });
  }
}







/* ****************************************
 *  Process login request
 * ************************************ */
/*async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

/*const accountController = {};

// Deliver the account management view
accountController.buildAccountManagement = async function (req, res) {
  res.render("account/accountManagement", {
    title: "Account Management",
    messages: req.flash("notice"),
    errors: req.flash("error")
  });
};*/




/* ****************************************
 *  Export all functions
 * *************************************** *
module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildAccount,
  buildAccountUpdate,
  updateAccount,
  changePassword,
  accountLogout,
  buildAccountList,
  accountController,
};*/
/*module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildAccount,
  buildAccountUpdate,
  updateAccount,
  changePassword,
  accountLogout,
  buildAccountList,
};*/
const bcrypt = require("bcryptjs");
const utilities = require("../utilities");
const accountModel = require("../models/account-model");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { validationResult } = require("express-validator");

/* ****************************************
 *  Login form
 **************************************** */
async function buildLogin(req, res) {
  const nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    message: req.flash("notice"),
    errors: null,
  });
}

/* ****************************************
 *  Registration form
 **************************************** */
async function buildRegister(req, res) {
  const nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    message: req.flash("notice"),
    errors: null,
  });
}

/* ****************************************
 *  Process Registration
 **************************************** */
async function registerAccount(req, res) {
  const nav = await utilities.getNav();
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render("account/register", {
      title: "Register",
      nav,
      errors: errors.array(),
      message: null,
      locals: {
        account_firstname: req.body.account_firstname,
        account_lastname: req.body.account_lastname,
        account_email: req.body.account_email
      }
    });
  }

  const { account_firstname, account_lastname, account_email, account_password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(account_password, 10);

    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    );

    if (regResult) {
      req.flash("notice", `Congratulations, you're registered ${account_firstname}. Please log in.`);
      return res.render("account/login", { title: "Login", nav, message: req.flash("notice") });
    }

    req.flash("notice", "Sorry, registration failed.");
    return res.render("account/register", { title: "Register", nav, message: req.flash("notice") });

  } catch (error) {
    console.error("Registration error:", error);
    req.flash("notice", "An error occurred during registration.");
    return res.render("account/register", { title: "Register", nav, message: req.flash("notice") });
  }
}

/* ****************************************
 *  Process Login
 **************************************** */
async function accountLogin(req, res) {
  const nav = await utilities.getNav();
  const { account_email, account_password } = req.body;

  const accountData = await accountModel.getAccountByEmail(account_email);

  if (!accountData) {
    req.flash("notice", "Incorrect credentials.");
    return res.render("account/login", { title: "Login", nav, errors: null, account_email });
  }

  try {
    const isMatch = await bcrypt.compare(account_password, accountData.account_password);

    if (!isMatch) {
      req.flash("notice", "Incorrect credentials.");
      return res.render("account/login", { title: "Login", nav, errors: null, account_email });
    }

    delete accountData.account_password;

    const token = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1h"
    });

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600 * 1000
    });

    return res.redirect("/account/");

  } catch (err) {
    console.error("Login error:", err);
    req.flash("notice", "Login error occurred.");
    return res.render("account/login", { title: "Login", nav, errors: null, account_email });
  }
}

/* ****************************************
 *  Account Management Page
 **************************************** */
async function buildAccount(req, res) {
  const nav = await utilities.getNav();

  const messages = req.flash("notice") || [];
  const errors = req.flash("error") || [];

  let account_firstname = "User";

  try {
    if (req.cookies.jwt) {
      const decoded = jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET);
      account_firstname = decoded.account_firstname;
       account_id = decoded.account_id;        // ADD THIS
      account_type = decoded.account_type;    // ADD THIS
    }
  } catch (err) {}

  res.render("account/account-management", {
    title: "Account Management",
    nav,
    messages,
    errors,
    account_firstname,
    account_id,       // ADD THIS
    account_type      // ADD THIS
  });
}

/* ****************************************
 *  Build Update Account Page
 **************************************** */
async function buildAccountUpdate(req, res) {
  const account_id = parseInt(req.params.account_id);
  const accountData = await accountModel.getAccountById(account_id);

  if (!accountData) {
    req.flash("notice", "Account not found");
    return res.redirect("/account/");
  }

  const nav = await utilities.getNav();
  res.render("account/update", {
    title: "Edit Account",
    nav,
    errors: null,
    accountData
  });
}

/* ****************************************
 *  Update Account (Fixes missing function!)
 **************************************** */
async function updateAccount(req, res) {
  const nav = await utilities.getNav();
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render("account/update", {
      title: "Edit Account",
      nav,
      errors: errors.array(),
      accountData: req.body
    });
  }

  try {
    const { account_id, account_firstname, account_lastname, account_email } = req.body;

    const updateResult = await accountModel.updateAccount(
      account_firstname,
      account_lastname,
      account_email,
      account_id
    );

    if (updateResult) {
      req.flash("notice", "Account updated successfully.");
      return res.redirect("/account/");
    }

    req.flash("notice", "Failed to update account.");
    return res.render("account/update", {
      title: "Edit Account",
      nav,
      errors: null,
      accountData: req.body
    });

  } catch (error) {
    console.error("Account update error:", error);
    req.flash("notice", "Error updating account.");
    return res.render("account/update", { title: "Edit Account", nav, errors: null, accountData: req.body });
  }
}

/* ****************************************
 *  Change Password
 **************************************** */
async function changePassword(req, res) {
  const nav = await utilities.getNav();
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render("account/update", {
      title: "Edit Account",
      nav,
      errors,
      accountData: res.locals.accountData
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(req.body.account_password, 10);
    const result = await accountModel.updatePassword(hashedPassword, req.body.account_id);

    if (result) {
      req.flash("notice", "Password updated.");
      return res.redirect("/account/");
    }

    req.flash("notice", "Could not update password.");
    return res.render("account/update", { title: "Edit Account", nav, errors: null, accountData: res.locals.accountData });

  } catch (err) {
    console.error("Password update failed:", err);
    req.flash("notice", "Error updating password.");
    return res.render("account/update", { title: "Edit Account", nav, errors: null, accountData: res.locals.accountData });
  }
}

/* ****************************************
 *  Logout
 **************************************** */
async function accountLogout(req, res) {
  res.clearCookie("jwt");
  req.flash("notice", "You have been logged out.");
  res.redirect("/");
}

/* ****************************************
 *  List all accounts
 **************************************** */
async function buildAccountList(req, res) {
  const nav = await utilities.getNav();
  try {
    const accountList = await accountModel.getAllAccounts();
    res.render("account/account-list", {
      title: "All User Accounts",
      nav,
      accountList,
      errors: null
    });
  } catch (err) {
    console.error("Account list error:", err);
    req.flash("notice", "Could not load account list.");
    res.redirect("/account/");
  }
}

/* ****************************************
 *  EXPORTS — Now Correct!
 **************************************** */
module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildAccount,
  buildAccountUpdate,
  updateAccount,
  changePassword,
  accountLogout,
  buildAccountList
};


