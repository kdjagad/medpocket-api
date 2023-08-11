const db = require("../../config/db.config");

module.exports = {
  searchBrand: (query, callback) => {
    db.query(
      `select p.*,b.* from products p left outer join brands b on b.name=p.brand where (p.brand LIKE CONCAT(?, '%')) group by p.brand`,
      [query],
      (error, results, fields) => {
        if (error) {
          callback(error);
        }
        return callback(null, results || null);
      }
    );
  },
  searchBrandByCompany: (company, callback) => {
    db.query(
      `select p.*,b.* from products p left outer join brands b on b.name=p.brand where (p.COMPANY LIKE CONCAT(?, '%')) group by p.brand`,
      [company],
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
