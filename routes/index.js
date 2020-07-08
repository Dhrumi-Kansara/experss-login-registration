const express = require("express");
const router = express.Router();
const { ensureAuthenticated }  = require("../config/auth");



//welcome route
router.get("/",(req, res) => res.render("welcome"));

// dashbord route
router.get("/dashbord", ensureAuthenticated, (req, res) => res.render("dashbord", {
  name: req.user.name
}));

module.exports = router;