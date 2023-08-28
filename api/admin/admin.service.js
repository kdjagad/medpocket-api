const db = require("../../config/db.config");

module.exports = {
  login: (username, password, callback) => {
    db.query(
      `select * from admin where username=? and password=?`,
      [username, password],
      (error, results, fields) => {
        if (error) {
          callback(error);
        }
        return callback(null, results || null);
      }
    );
  },
  getUsers: (is_request = false, callback) => {
    var where = "";
    if (is_request) where = " where stockiest_requested=1";
    db.query(`select * from users ${where}`, [], (error, results, fields) => {
      if (error) {
        callback(error);
      }
      return callback(null, results || null);
    });
  },
};
