var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { checkNotAuthenticated } = require("../config/auth");

passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    function (username, password, done) {
      if (username === "akito" && password === "1111") {
        return done(null, username);
      } else {
        return done(null, false);
      }
    }
  )
);

// session
// passport.serializeUser(function (user, done) {
//   done(null, user);
// });

// passport.deserializeUser(function (user, done) {
//   done(null, user);
// });

/* GET users listing. */

// register
router.get("/register", checkNotAuthenticated, function (req, res, next) {
  res.render("register", { title: "register" });
});

router.post("/register", async function (req, res, next) {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
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
