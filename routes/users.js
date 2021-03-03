var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");
const { checkNotAuthenticated } = require("../config/auth");

/* GET users listing. */

// register
router.get("/register", checkNotAuthenticated, function (req, res, next) {
  res.render("register", { title: "register" });
});

router.post("/register", async function (req, res, next) {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    res.redirect("/users/login");
  } catch {
    res.redirect("/users/register");
  }
});

// login
router.get("/login", checkNotAuthenticated, function (req, res, next) {
  res.render("login", { title: "login" });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/login",
    failureFlash: true,
  })
);

// logout
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/users/login");
});

module.exports = router;
