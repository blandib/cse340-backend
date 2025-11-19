/* ******************************************
* This server.js file is the primary file of the
* application. It is used to control the project.
*******************************************/
/* ***********************
* Require Statements
*************************/
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const app = express();
const static = require("./routes/static");
const baseController = require("./controllers/baseController");
const utilities = require("./utilities/");
const  inventoryRoute = require("./routes/inventoryRoute");
/* ***********************
* View Engine and Templates
*************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout"); // not at views root

/* ***********************
* Routes
*************************/
app.use(static);
//inventory routes
app.use("/inv", inventoryRoute);

//app.use("/", (req, res) => {
//res.render("index", { title: "Home" });
//});
//index route
app.get("/", utilities.handleErrors(baseController.buildHome));
// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
  
})
/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use((err, req, res, next) => {
  utilities.getNav().then(nav => {
    console.error(`Error at: "${req.originalUrl}": ${err.message}`);
    
    const message = err.status == 404 
      ? err.message 
      : 'Oh no! There was a crash. Maybe try a different route?';

    res.status(err.status || 500).render("errors/error", {
      title: err.status || ' 500 Server Error',
      message,
      errorDetails: err.message, 
      nav
    });
  }).catch(error => {
    console.error("Navigation generation failed: " + error);
    res.status(500).render("errors/error", {
      title: "Server Error",
      message: "An unexpected error occurred. Please try again later.",
      errorDetails: error.message, 
      nav: ''
    });
  });
});
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 404){ message = err.message} else {message = 'Oh no! There was a crash. Maybe try a different route?'}
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})

/* ***********************
* Local Server Information
* Values from .env (environment) file
*************************/
const port = process.env.PORT;
const host = process.env.HOST;

/* ***********************
* Log statement to confirm server operation
*************************/
app.listen(port, () => {
console.log(`app listening on ${host}:${port}`);
});