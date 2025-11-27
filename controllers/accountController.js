const bcrypt = require("bcryptjs");
const utilities = require("../utilities");
const accountModel = require("../models/account-model");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { validationResult } = require("express-validator");

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
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
async function buildRegister(req, res, next) {
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
async function registerAccount(req, res) {
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
async function accountLogin(req, res) {
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

/* ****************************************
 *  Deliver account management view
 * *************************************** */
async function buildAccount(req, res, next) {
  const nav = await utilities.getNav();
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
    errors: null,
    account_firstname,
  });
}

/* ****************************************
 *  Deliver account update view
 * *************************************** */
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
 *  Process account update
 * *************************************** */
async function updateAccount(req, res, next) {
  const nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_id } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("account/update", {
      title: "Edit Account",
      nav,
      errors,
      accountData: { account_id, account_firstname, account_lastname, account_email },
    });
  }

  try {
    const currentAccount = await accountModel.getAccountById(account_id);
    if (!currentAccount) {
      req.flash("notice", "Account not found.");
      return res.redirect("/account/");
    }

    if (account_email !== currentAccount.account_email) {
      const emailExists = await accountModel.checkExistingEmail(account_email);
      if (emailExists) {
        req.flash("notice", "Email already exists. Please use a different email.");
        return res.render("account/update", {
          title: "Edit Account",
          nav,
          errors: null,
          accountData: { account_id, account_firstname, account_lastname, account_email },
        });
      }
    }

    const updateResult = await accountModel.updateAccount(account_firstname, account_lastname, account_email, account_id);

    if (updateResult) {
      req.flash("notice", "Account information updated successfully.");
      return res.redirect("/account/");
    } else {
      req.flash("notice", "Failed to update account information. Please try again.");
      return res.render("account/update", {
        title: "Edit Account",
        nav,
        errors: null,
        accountData: { account_id, account_firstname, account_lastname, account_email },
      });
    }
  } catch (error) {
    console.error("Error updating account:", error);
    req.flash("notice", "An error occurred during account update.");
    return res.render("account/update", {
      title: "Edit Account",
      nav,
      errors: null,
      accountData: { account_id, account_firstname, account_lastname, account_email },
    });
  }
}

/* ****************************************
 *  Process password change
 * *************************************** */
async function changePassword(req, res, next) {
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
async function accountLogout(req, res, next) {
  res.clearCookie("jwt");
  req.flash("notice", "You have been logged out.");
  return res.redirect("/");
}

/* ****************************************
 *  Build account list
 * *************************************** */
async function buildAccountList(req, res, next) {
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
 *  Export all functions
 * *************************************** */
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
};
