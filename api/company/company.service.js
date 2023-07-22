const db = require("../../config/db.config");

module.exports = {
  searchCompany: (query, callback) => {
    db.query(
      `select * from company where (Name LIKE CONCAT(?, '%'))`,
      [query],
      (error, results, fields) => {
        if (error) {
          callback(error);
        }
        return callback(null, results || null);
      }
    );
  },
  searchCompanyToStockiest: (query, user, isSearch, callback) => {
    var queryString = `select c.*,s.* from crossreference c left outer join stockiests s ON (s.firm_name LIKE CONCAT(SUBSTRING_INDEX(c.FIRM_NAME,'-',1),'%')) where (c.COMPANY_NAME LIKE CONCAT(?,'%')) and c.CENTER=?`;
    if (!isSearch) {
      queryString = `select c.*,s.* from crossreference c left outer join stockiests s ON (s.firm_name LIKE CONCAT(SUBSTRING_INDEX(c.FIRM_NAME,'-',1),'%')) where c.COMPANY_NAME=? and c.CENTER=?`;
    }
    db.query(queryString, [query, user.city], (error, results, fields) => {
      if (error) {
        callback(error);
      }
      if (isSearch)
        results = results.filter(
          (arr, index, self) =>
            index === self.findIndex((t) => t.COMPANY_NAME === arr.COMPANY_NAME)
        );
      return callback(null, results || null);
    });
  },
  searchStockiestToCompany: (query, user, isSearch, callback) => {
    var queryString = `select c.*,s.* from crossreference c left outer join stockiests s ON (s.firm_name LIKE CONCAT(SUBSTRING_INDEX(c.FIRM_NAME,'-',1),'%')) where (c.FIRM_NAME LIKE CONCAT(?,'%')) and c.CENTER=?`;
    if (!isSearch) {
      queryString = `select c.*,s.* from crossreference c left outer join stockiests s ON (s.firm_name LIKE CONCAT(SUBSTRING_INDEX(c.FIRM_NAME,'-',1),'%')) where c.FIRM_NAME=? and c.CENTER=?`;
    }
    db.query(queryString, [query, user.city], (error, results, fields) => {
      if (error) {
        callback(error);
      }
      if (isSearch)
        results = results.filter(
          (arr, index, self) =>
            index === self.findIndex((t) => t.FIRM_NAME === arr.FIRM_NAME)
        );
      return callback(null, results || null);
    });
  },
};
