const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  res.render("index", {title: "Home", nav})
}
baseController.handleError = async function(req, res) {
  const nav = await utilities.getNav()
  res.render("errors/error", {
    title: "Not Found",
    message: "Something went wrong!",
    nav
  })
}


module.exports = baseController