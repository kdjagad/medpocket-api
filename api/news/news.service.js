const db = require("../../config/db.config");

module.exports = {
  getNews: (user, callback) => {
    db.query(
      `select * from news where CENTER=?`,
      [user.city],
      (error, results, fields) => {
        if (error) {
          callback(error);
        }
        return callback(null, results || null);
      }
    );
  },
};
