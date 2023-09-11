const FCM = require("fcm-node");
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
  getNews: (callback) => {
    db.query(`select *,ID as id from news`, [], (error, results, fields) => {
      if (error) {
        callback(error);
      }
      return callback(null, results || null);
    });
  },
  getCenters: (callback) => {
    db.query(
      `select center from centers where isEnabled=1`,
      [],
      (error, results, fields) => {
        if (error) {
          callback(error);
        }
        return callback(null, results || null);
      }
    );
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
  sendPushNotification: (reg_ids, title, message, callback) => {
    var fcm = new FCM(process.env.SERVER_KEY || "");
    if (reg_ids.length > 0) {
      var pushMessage = {
        //this may vary according to the message type (single recipient, multicast, topic, et cetera)
        registration_ids: reg_ids,
        content_available: true,
        mutable_content: true,
        notification: {
          title: title,
          body: message,
          icon: "myicon", //Default Icon
          sound: "mySound", //Default sound
          // badge: badgeCount, example:1 or 2 or 3 or etc....
        },
        // data: {
        //   notification_type: 5,
        //   conversation_id:inputs.user_id,
        // }
      };

      fcm.send(pushMessage, function (err, response) {
        if (err) {
          console.log("Something has gone wrong!", err);
          return callback(err);
        } else {
          return callback(null, response);
        }
      });
    }
  },
  addNews: (data, callback) => {
    db.query(
      `insert into news(messageHeader,messageDetail,center) values(?,?,?)`,
      [data.messageHeader, data.messageDetail, data.center],
      (error, results, fields) => {
        if (error) {
          callback(error);
        }
        return callback(null, results);
      }
    );
  },
  getFcmTokens: (center, callback) => {
    var where = " WHERE AND city=?";
    if (center == "All") where = "";
    db.query(
      `select * from users ${where}`,
      [center],
      (error, results, fields) => {
        if (error) {
          callback(error);
        }
        const data = [];
        if (results && results.length) {
          results.map((dt) => {
            if (dt["fcm_token"]) {
              data.push(dt["fcm_token"]);
            }
          });
        }
        return callback(null, data);
      }
    );
  },
};
