require("dotenv").config();
const mysql = require("mysql");

const dbCon = mysql.createPool({
  connectionLimit: 1000,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.MYSQL_DB,
  debug: false,
});

// dbCon.connect(function (error) {
//   if (error) throw error;
// });

module.exports = dbCon;
