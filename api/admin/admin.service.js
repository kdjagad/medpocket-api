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
    if (is_request) where = " where stockiest_requested=?";
    db.query(`select * from users ${where}`, [1], (error, results, fields) => {
      if (error) {
        callback(error);
      }
      return callback(null, results || null);
    });
  },
  getKeys: (callback) => {
    db.query(`select * from valid_keys`, [], (error, results, fields) => {
      if (error) {
        callback(error);
      }
      return callback(null, results || null);
    });
  },
  getUserById: (id, callback) => {
    db.query(
      `select * from users where id=?`,
      [id],
      (error, results, fields) => {
        if (error) {
          callback(error);
        }
        return callback(null, results.length ? results[0] : null);
      }
    );
  },
  updateUserById: (body, id, callback) => {
    delete body["id"];
    delete body["created_at"];
    const data = [];
    Object.keys(body).map((key) => {
      if (key != "id") data.push(`${key}=?`);
    });
    db.query(
      `update users set ${data.join(", ")} where id=?`,
      [...Object.values(body), id],
      (error, results, fields) => {
        if (error) {
          callback(error);
        }
        return callback(null, results);
      }
    );
  },
};
