const db = require("../../config/db.config");

module.exports = {
  searchBrand: (query, callback) => {
    db.query(
      `select * from brands where (Name LIKE CONCAT(?, '%') OR  ID LIKE CONCAT(?, '%') OR  Packing LIKE CONCAT(?, '%') OR  Company_id LIKE CONCAT(?, '%'))`,
      [query, query, query, query],
      (error, results, fields) => {
        if (error) {
          callback(error);
        }
        return callback(null, results || null);
      }
    );
  },
  searchBrandByCompany: (company_id, callback) => {
    db.query(
      `select * from brands where Company_id=?`,
      [company_id],
      (error, results, fields) => {
        if (error) {
          callback(error);
        }
        return callback(null, results || null);
      }
    );
  },
  searchBrandByGeneric: (generic, callback) => {
    db.query(
      `select * from brands where Generic=?`,
      [generic],
      (error, results, fields) => {
        if (error) {
          callback(error);
        }
        return callback(null, results || null);
      }
    );
  },
};
