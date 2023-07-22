const db = require("../../config/db.config");

module.exports = {
  searchGeneric: (query, callback) => {
    db.query(
      `select * from generic where (generic LIKE CONCAT(?, '%'))`,
      [query],
      (error, results, fields) => {
        if (error) {
          callback(error);
        }
        return callback(null, results || null);
      }
    );
  },
};
