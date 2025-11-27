const invModel = require("../models/inventory-model");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const Util = {};

/************************
 * Constructs the nav HTML unordered list
 **************************/
Util.getNav = async function () {
  let data = await invModel.getClassifications();
  let classifications = data.rows; 

  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  classifications.forEach((row) => {
    list += "<li>";
    list += `<a href="/inv/type/${row.classification_id}" title="See our inventory of ${row.classification_name} vehicles">${row.classification_name}</a>`;
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

/**************************************
* Build the classification view HTML
************************************/
Util.buildClassificationGrid = async function(data){
  let grid;
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => {
      const className = vehicle.classification_name.toLowerCase().replace(/\s+/g, '-'); 
      grid += `<li class="${className}">`;
      grid += `<a href="/inv/itemDetail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">`;
      grid += `<img src="${vehicle.inv_thumbnail}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors" /></a>`;
      grid += '<div class="namePrice">';
      grid += '<hr />';
      grid += `<h2>${vehicle.inv_make} ${vehicle.inv_model}</h2>`;
      grid += `<span>$${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</span>`;
      grid += `<p><strong>Year:</strong> ${vehicle.inv_year}</p>`;
      grid += `<p><strong>Color:</strong> ${vehicle.inv_color}</p>`;
      grid += `<p><strong>Description:</strong> ${vehicle.inv_description}</p>`;
      grid += '</div>';
      grid += '</li>';
    });
    grid += '</ul>';
  } else { 
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
}

/****************************************
 * Middleware For Handling Errors
 ****************************************/
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

/****************************************
 * Middleware: Check if user is logged in
 ****************************************/
Util.checkLogin = (req, res, next) => {
  const token = req.cookies?.jwt;
  if (!token) {
    req.flash("notice", "You must be logged in to view this page.");
    return res.redirect("/account/login");
  }
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    res.locals.account_id = decoded.account_id;
    next();
  } catch (err) {
    req.flash("notice", "Invalid session. Please log in again.");
    return res.redirect("/account/login");
  }
};

/****************************************
 * Middleware: Check account ownership
 ****************************************/
Util.checkAccountOwnership = (req, res, next) => {
  const accountIdFromToken = res.locals.account_id;
  const accountIdFromParams = parseInt(req.params.account_id);
  if (accountIdFromToken !== accountIdFromParams) {
    req.flash("notice", "You do not have permission to access this account.");
    return res.redirect("/account/");
  }
  next();
};

/****************************************
 * Middleware: Check admin authorization
 ****************************************/
Util.checkAdminAuth = (req, res, next) => {
  const token = req.cookies?.jwt;
  if (!token) {
    req.flash("notice", "You must be logged in as an admin.");
    return res.redirect("/account/login");
  }
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decoded.is_admin) {
      req.flash("notice", "You are not authorized to view this page.");
      return res.redirect("/account/");
    }
    next();
  } catch (err) {
    req.flash("notice", "Invalid session. Please log in again.");
    return res.redirect("/account/login");
  }
};

/****************************************************************************
 * Build a Custom Utility Function to Format Inventory Data
 ****************************************************************************/
function buildItemHTML(item) {
  if (!item || typeof item !== 'object') {
    console.error("Invalid item passed to buildItemHTML:", item);
    return `<p class="error">Vehicle data could not be loaded.</p>`;
  }

  const price = parseFloat(item.inv_price) || 0;
  const miles = parseInt(item.inv_miles) || 0;

  const priceFormatted = price.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD'
  });

  const milesFormatted = miles.toLocaleString();

  return `
    <div class="vehicle-detail-container">
      <img 
        class="vehicle-image" 
        src="${item.inv_image}" 
        alt="Image of ${item.inv_make} ${item.inv_model}" 
        loading="lazy" 
        width="600" height="400">

      <div class="vehicle-info">
        <h1>${item.inv_make} ${item.inv_model} (${item.inv_year})</h1>
        <p><strong>Price:</strong> ${priceFormatted}</p>
        <p><strong>Mileage:</strong> ${milesFormatted} miles</p>
        <p><strong>Color:</strong> ${item.inv_color}</p>
        <p><strong>Description:</strong> ${item.inv_description}</p>
      </div>
    </div>
  `;
}
//****************************************************************************
/* Build classification select list */
async function buildClassificationList(selectedId = null) {
  const data = await invModel.getClassifications(); // data = { rows: [...] }
  const rows = data.rows; // extract array

  let classificationList = '<select name="classification_id" id="classificationList" required>';
  classificationList += "<option value=''>Choose a Classification</option>";

  rows.forEach(row => {
    classificationList += `<option value="${row.classification_id}"`;
    if (selectedId != null && row.classification_id === selectedId) {
      classificationList += " selected";
    }
    classificationList += `>${row.classification_name}</option>`;
  });

  classificationList += "</select>";
  return classificationList;
}




module.exports = {
  getNav: Util.getNav,
  buildClassificationGrid: Util.buildClassificationGrid,
  buildItemHTML,
  handleErrors: Util.handleErrors,
  checkLogin: Util.checkLogin,
  checkAccountOwnership: Util.checkAccountOwnership,
  checkAdminAuth: Util.checkAdminAuth,
  buildClassificationList,
};
