// utilities/account-auth.js
const jwt = require("jsonwebtoken");

/*function requireLogin(req, res, next) {
  const token = req.cookies?.jwt;
  if (!token) {
    req.flash("notice", "Please login to continue.");
    return res.redirect("/account/login");
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.account = payload;
    return next();
  } catch (err) {
    req.flash("notice", "Please login to continue.");
    return res.redirect("/account/login");
  }
}

function requireEmployeeOrAdmin(req, res, next) {
  const token = req.cookies?.jwt;
  if (!token) {
    req.flash("notice", "You must be logged in with the right permissions.");
    return res.redirect("/account/login");
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.account_type === "Employee" || payload.account_type === "Admin") {
      req.account = payload;
      return next();
    } else {
      req.flash("notice", "Insufficient permissions.");
      return res.redirect("/account/login");
    }
  } catch (err) {
    req.flash("notice", "Please login to continue.");
    return res.redirect("/account/login");
  }
}

module.exports = {
  requireLogin,
  requireEmployeeOrAdmin,
};*/
function requireLogin(req, res, next) {
  console.log("=== requireLogin DEBUG ===");
  console.log("Cookie exists:", !!req.cookies?.jwt);
  
  const token = req.cookies?.jwt;
  if (!token) {
    console.log("No token found");
    req.flash("notice", "Please login to continue.");
    return res.redirect("/account/login");
  }
  
  try {
    console.log("Trying to verify with ACCESS_TOKEN_SECRET...");
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("Token verified successfully");
    console.log("Payload:", payload);
    req.account = payload;
    return next();
  } catch (err) {
    console.log("JWT verification failed:", err.message);
    
    // Try with JWT_SECRET as fallback
    try {
      console.log("Trying with JWT_SECRET...");
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Token verified with JWT_SECRET");
      req.account = payload;
      return next();
    } catch (err2) {
      console.log("Both secrets failed");
      req.flash("notice", "Please login to continue.");
      return res.redirect("/account/login");
    }
  }
}
