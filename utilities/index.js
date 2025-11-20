const invModel = require("../models/inventory-model");

const Util = {};

 /************************
 * Constructs the nav HTML unordered list
 **************************/
Util.getNav = async function () {
  let data = await invModel.getClassifications();
  let classifications = data.rows; 

  let list = "<ul>";
  console.log(classifications);

  list += '<li><a href="/" title="Home page">Home</a></li>';
  classifications.forEach((row) => {
    list += "<li>";
    list += `<a href="/inv/type/${row.classification_id}" title="See our inventory of ${row.classification_name} vehicles">${row.classification_name}</a>`;
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

/* **************************************
* Build the classification view HTML
* ************************************ */

Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => {
  const className = vehicle.classification_name.toLowerCase().replace(/\s+/g, '-'); 
  grid += `<li class="${className}">`;
 grid += `<a href="/inv/itemDetail/${vehicle.inv_id}"title="View ${vehicle.inv_make} ${vehicle.inv_model} details">`;

  grid += `<img src="${vehicle.inv_thumbnail}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors" /></a>`;
  grid += '<div class="namePrice">';
  grid += '<hr />';
  grid += '<h2>';
  grid += `<a href="/inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">`;

  grid += '</h2>';
  grid += `<span>$${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</span>`;
  grid += `<p><strong>Year:</strong> ${vehicle.inv_year}</p>`;
  grid += `<p><strong>Color:</strong> ${vehicle.inv_color}</p>`;
  grid += `<p><strong>Description:</strong> ${vehicle.inv_description}</p>`;
  grid += '</div>';
  grid += '</li>';
});

    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
/****************************************************************************
 *  Build a Custom Utility Function to 
 * Format the Inventory Data****
 * **************************************************** */
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

function handleErrors(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

module.exports = {
 getNav: Util.getNav,
  buildClassificationGrid: Util.buildClassificationGrid,
  buildItemHTML,
  handleErrors: Util.handleErrors
};