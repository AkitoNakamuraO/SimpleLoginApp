var express = require("express");
var router = express.Router();
const { checkAuthenticated } = require("../config/auth");

/* GET home page. */
router.get("/", checkAuthenticated, function (req, res, next) {
  console.log(req.session);
  res.render("index", {
    title: "index",
    username: req.session.passport.user.username,
  });
});

module.exports = router;
