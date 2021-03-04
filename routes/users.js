var express = require("express");
var router = express.Router();
const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { checkNotAuthenticated } = require("../config/auth");
const e = require("express");

const pool = mysql.createPool({
  host: "us-cdbr-east-03.cleardb.com",
  port: 3306,
  user: "b326b65a6a8a4e",
  password: "ba9ed138",
  database: "heroku_ca7a263364fcc5a",
});

const createConnection = function () {
  return new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error) reject(error);
      resolve(connection);
    });
  });
};

passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    async function (username, password, done) {
      const sql = "SELECT * FROM users WHERE name = ?";
      const users = await checkUser(sql, username);
      for (i = 0; i < users.length; i++) {
        if (await bcrypt.compare(password, users[i].password)) {
          return done(null, username);
        }
      }
      return done(null, false);
    }
  )
);

function insertUser(sql, username, hashedPassword) {
  return new Promise(async (resolve) => {
    const connection = await createConnection();
    connection.connect();
    connection.query(
      sql,
      [username, hashedPassword],
      function (err, rows, fields) {
        resolve(rows);
      }
    );
    connection.end();
  });
}

function checkUser(sql, username) {
  return new Promise(async (resolve) => {
    const connection = await createConnection();
    connection.connect();
    connection.query(sql, username, function (err, rows, fields) {
      resolve(rows);
    });
    connection.end();
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
    if (username.length <= 0 || password.length <= 0) {
      throw new Error("register error");
    }
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
  function (req, res, next) {
    try {
      if (req.username.length <= 0 || req.password.length <= 0) {
        throw new Error("login error");
      }
    } catch {
      res.redirect("/users/login");
    }
  },
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
