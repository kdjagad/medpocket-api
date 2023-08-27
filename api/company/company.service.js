const db = require("../../config/db.config");

// const groupBy = (items, key, findKey) => {
//   const filtered = items.filter(
//     (arr, index, self) =>
//       index === self.findIndex((t) => t[findKey] === arr[findKey])
//   );
//   const arr = [];
//   filtered.map((ft) => {
//     arr.push({
//       ...ft,
//       [key]: items.filter((dt) => dt[findKey] == ft[findKey]),
//     });
//   });
//   return arr;
// };

module.exports = {
  searchCompany: (query, callback) => {
    db.query(
      `select * from products where (COM_FULL LIKE CONCAT('%',?,'%')) group by COM_FULL`,
      [query],
      (error, results, fields) => {
        if (error) {
          callback(error);
        }
        // results = groupBy(results, "BRANDS", "COM_FULL");
        return callback(null, results || null);
      }
    );
  },
  searchCompanyToStockiest: (query, user, isSearch, callback) => {
    var queryString = `select c.*,s.* from crossreference c left outer join stockiests s ON (s.firm_name LIKE CONCAT(SUBSTRING_INDEX(c.FIRM_NAME,'-',1),'%')) where (c.COMPANY_NAME LIKE CONCAT(?,'%')) and c.CENTER=?`;
    if (!isSearch) {
      queryString = `select * from crossreference where (COMPANY_NAME LIKE CONCAT(?,'%')) and CENTER=?`;
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
      queryString = `select * from crossreference where (FIRM_NAME LIKE CONCAT(?,'%')) and CENTER=?`;
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
