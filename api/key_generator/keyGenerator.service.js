const db = require("../../config/db.config");

module.exports = {
  getLicences: (user, callback) => {
    db.query(
      `select * from valid_keys where is_used=0`,
      [],
      (error, results, fields) => {
        if (error) {
          callback(error);
        }
        return callback(null, results || null);
      }
    );
  },
  generateLicences: (params, user, callback) => {
    debugger;
    const licenseGen = require("@mcnaveen/license-gen");
    const { count = 0 } = params;
    const errors = [];
    let rowCount = 0;
    for (var i = 0; i < count; i++) {
      const key = licenseGen(16);
      db.query(
        `insert into valid_keys(reg_key) values(?)`,
        [key],
        (error, results, fields) => {
          if (error) {
            errors.push(error);
          } else {
            rowCount += 1;
          }
        }
      );
    }
    if (errors.length) {
      callback(errors[0]);
    } else {
      callback(null, { affectedRows: rowCount });
    }
  },
};
