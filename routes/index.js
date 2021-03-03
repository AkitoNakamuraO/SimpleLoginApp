var express = require("express");
var router = express.Router();
const { checkAuthenticated } = require("../config/auth");

/* GET home page. */
router.get("/", checkAuthenticated, function (req, res, next) {
  res.render("index", { title: "index", user: req.session.passport.user });
});

module.exports = router;
