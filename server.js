/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const path = require("path")

/* ***********************
 * Middleware
 *************************/
app.use(express.static(path.join(__dirname, "public")))
app.use(expressLayouts)


/* ***********************
 * View Engine and Templates
 *************************/
//app.use(static)
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root
app.set("views", path.join(__dirname, "views"))

/* ***********************
 * Routes
 *************************/
app.use(static)
//Index route
app.get("/", function (req, res) {
  res.render("index", { title: "Home" })
})
/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})