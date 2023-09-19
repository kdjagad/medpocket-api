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
      `select * from products WHERE MATCH(COM_FULL) AGAINST(?) group by COM_FULL`,
      // `select * from products where (COM_FULL LIKE CONCAT('%',?,'%')) group by COM_FULL`,
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
  companyToStockiest: (query, user, callback) => {
    //
    var queryString = `select * from crossreference where MATCH(COMPANY_NAME) AGAINST(?) and CENTER=?`;

    db.query(queryString, [query, user.city], (error, results, fields) => {
      if (error) {
        callback(error);
      }

      results = results.filter(
        (arr, index, self) =>
          index === self.findIndex((t) => t.COMPANY_NAME === arr.COMPANY_NAME)
      );
      return callback(null, results || null);
    });
  },
  stockiestFromCompany: (query, user, callback) => {
    //
    var queryString = `SELECT * FROM crossreference WHERE COMPANY_NAME=? and CENTER=?`;

    db.query(queryString, [query, user.city], (error, results, fields) => {
      if (error) {
        callback(error);
      }

      return callback(null, results || null);
    });
  },
  stockiestToCompany: (query, user, callback) => {
    //
    var queryString = `select * from crossreference where MATCH(FIRM_NAME) AGAINST(?) and CENTER=?`;

    db.query(queryString, [query, user.city], (error, results, fields) => {
      if (error) {
        callback(error);
      }

      results = results.length
        ? results.filter(
            (arr, index, self) =>
              index === self.findIndex((t) => t.FIRM_NAME === arr.FIRM_NAME)
          )
        : [];
      return callback(null, results || null);
    });
  },
  companyFromStockiest: (query, user, callback) => {
    //
    var queryString = `select c.*,s.* from crossreference c left outer join stockiests s ON (s.firm_name LIKE CONCAT(SUBSTRING_INDEX(c.FIRM_NAME,'-',1),'%')) where (c.FIRM_NAME LIKE CONCAT(?,'%'))`;

    db.query(queryString, [query, user.city], (error, results, fields) => {
      if (error) {
        callback(error);
      }

      results = results.filter(
        (arr, index, self) =>
          index === self.findIndex((t) => t.COMPANY_NAME === arr.COMPANY_NAME)
      );
      return callback(null, results || null);
    });
  },
  getStockiestDetails: (stockiest, callback) => {
    //
    var queryString = `select * from stockiests where REPLACE(firm_name," ","")=REPLACE(?," ","")`;

    db.query(queryString, [stockiest], (error, results, fields) => {
      if (error) {
        callback(error);
      }

      if (results.length) {
        return callback(null, results || null);
      } else {
        var queryString1 = `select * from chemistsdruggiest where REPLACE(firm_name," ","")=REPLACE(?," ","")`;
        db.query(queryString1, [stockiest], (error, results, fields) => {
          //
          if (error) {
            callback(error);
          }
          return callback(null, results || null);
        });
      }
    });
  },
};
