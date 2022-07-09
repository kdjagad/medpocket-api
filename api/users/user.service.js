const db = require('../../config/db.config');

module.exports = {
    create: (data, callback) => {
        db.query(`insert into users(firm_name,phone,city,uuid,device_id) values(?,?,?,?,?)`, [data.firm_name, data.phone, data.city, data.uuid, data.device_id], (error, results, fields) => {
            if (error) {
                callback(error);
            }
            return callback(null, results);
        })
    },
    getUserByPhone: (data, callback) => {
        db.query(`select * from users where phone=?`, [data.phone], (error, results, fields) => {
            if (error) {
                callback(error);
            }
            return callback(null, results);
        })
    },
    getUserById: (id, callback) => {
        db.query(`select * from users where id=?`, [id], (error, results, fields) => {
            if (error) {
                callback(error);
            }
            return callback(null, results.length ? results[0] : null);
        })
    },
    updateUserById: (body, id, callback) => {
        const data = Object.keys(body).map(key => `${key}=?`);
        db.query(`update users set ${data.join(', ')} where id='?'`, [...Object.values(body), id], (error, results, fields) => {
            if (error) {
                callback(error);
            }
            return callback(null, results);
        })
    },
}