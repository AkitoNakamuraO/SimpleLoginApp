const mysql = require("mysql");

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

module.exports = createConnection;
