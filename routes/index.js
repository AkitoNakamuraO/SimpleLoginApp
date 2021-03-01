var express = require("express");
var router = express.Router();
const { checkAuthenticated } = require("../config/auth");

/* GET home page. */
router.get("/", checkAuthenticated, function (req, res, next) {
  res.render("index", { title: "index" });
});

module.exports = router;
