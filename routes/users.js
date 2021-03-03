var express = require("express");
var router = express.Router();
const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { checkNotAuthenticated } = require("../config/auth");

/* GET users listing. */

function insertUser(sql, username, hashedPassword) {
  return new Promise((resolve) => {
    const connection = mysql.createConnection({
      host: "us-cdbr-east-03.cleardb.com",
      port: 3306,
      user: "b326b65a6a8a4e",
      password: "ba9ed138",
      database: "heroku_ca7a263364fcc5a",
    });
    connection.query(
      sql,
      [username, hashedPassword],
      function (err, rows, fields) {
        resolve(rows);
      }
    );
  });
}

// register
router.get("/register", checkNotAuthenticated, function (req, res, next) {
  res.render("register", { title: "register" });
});

router.post("/register", async function (req, res, next) {
  const { username, password } = req.body;
  const sql = "INSERT INTO users(name, password) values(?, ?);";
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await insertUser(sql, username, hashedPassword);
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
