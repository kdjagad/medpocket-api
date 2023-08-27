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
  getUsers: (callback) => {
    db.query(`select * from users`, [], (error, results, fields) => {
      if (error) {
        callback(error);
      }
      return callback(null, results || null);
    });
  },
};
