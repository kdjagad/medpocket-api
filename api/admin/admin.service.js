const FCM = require("fcm-node");
const db = require("../../config/db.config");

function cleanUrl(url) {
  return url.replace(/\\/g, "/");
}

async function checkDuplicate(row, table) {
  return new Promise((resolve, reject) => {
    const data = [];
    Object.keys(row).map((key) => {
      data.push(`${key}=?`);
    });
    db.query(
      `select * from ${table} WHERE ${data.join(" AND ")}`,
      [...Object.values(row)],
      (error, results, fields) => {
        if (error) {
          resolve(false);
        } else {
          resolve(results.length ? true : false);
        }
      }
    );
  });
}
function insertRows(rows, table, isIgnore = false) {
  return new Promise((resolve, reject) => {
    //debugger;
    const keys = Object.keys(rows[0]);
    var vals = [];
    rows.map((row) => {
      var values = Object.values(row);
      values = values.map((val) => addslashes(val));
      // values = values.map((val) => addslashes(val));

      vals.push(`('${values.join("','")}')`);
    });
    db.query(
      `insert into ${table}(${keys.join(",")}) values ${vals.join(",")}`,
      [],
      (error, results, fields) => {
        if (error) reject(error);
        resolve(results);
      }
    );
  });
}

function insertRowsPIS(rows, table) {
  return new Promise(async (resolve, reject) => {
    const keys = Object.keys(rows[0]);
    var vals = [];
    await Promise.all(
      rows.map((row) => {
        var values = Object.values(row);
        values = values.map((val) =>
          val != "" && val ? `'${addslashes(val)}'` : "NULL"
        );
        console.log(`vals (${values.join(",")})`);
        vals.push(`(${values.join(",")})`);
      })
    );
    if (vals.length)
      db.query(
        `insert ignore into ${table}(${keys.join(",")}) values ${vals.join(
          ","
        )}`,
        [],
        (error, results, fields) => {
          if (error) reject(error);
          resolve(results);
        }
      );
    else resolve(null);
  });
}

function addslashes(string) {
  if (typeof string === "string" || string instanceof String)
    return string
      .replace(/\\/g, "\\\\")
      .replace(/\u0008/g, "\\b")
      .replace(/\t/g, "\\t")
      .replace(/\n/g, "\\n")
      .replace(/\f/g, "\\f")
      .replace(/\r/g, "\\r")
      .replace(/'/g, "\\'")
      .replace(/"/g, '\\"');
  else return string;
}

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
  getKeys: (id, callback) => {
    var where = "";
    if (id) {
      where = ` WHERE batch_id='${id} '`;
    }
    db.query(
      `select * from valid_keys ${where}`,
      [],
      (error, results, fields) => {
        if (error) {
          callback(error);
        }
        return callback(null, results || null);
      }
    );
  },
  getKeysBatch: (callback) => {
    db.query(
      `select kb.*,sum(CASE WHEN vk.is_used=0 THEN 1 ELSE 0 END) as not_used_count,sum(vk.is_used) as used_count from keys_batch kb LEFT OUTER JOIN valid_keys vk ON kb.batch_id=vk.batch_id GROUP BY kb.batch_id ORDER BY kb.created DESC`,
      [],
      (error, results, fields) => {
        // debugger;
        if (error) {
          callback(error);
        }
        return callback(null, results || null);
      }
    );
  },
  getNews: (callback) => {
    db.query(
      `select *,ID as id from news order by msgTime desc`,
      [],
      (error, results, fields) => {
        if (error) {
          callback(error);
        }
        return callback(null, results || null);
      }
    );
  },
  getCenters: (callback) => {
    db.query(`select *,ID as id from centers`, [], (error, results, fields) => {
      if (error) {
        callback(error);
      }
      return callback(null, results || null);
    });
  },
  getCenterById: (id, callback) => {
    db.query(
      `select *,ID as id from centers where id=?`,
      [id],
      (error, results, fields) => {
        if (error) {
          callback(error);
        }
        return callback(null, results.length ? results[0] : null);
      }
    );
  },
  createCenter: (body, callback) => {
    const keys = Object.keys(body);
    const values = Object.values(body);
    db.query(
      `insert into centers(${keys.join(",")}) values('${values.join("','")}')`,
      [],
      (error, results, fields) => {
        if (error) {
          callback(error);
        }
        return callback(null, results || null);
      }
    );
  },
  postCenterAds: (body, attachments = [], baseUrl = "", callback) => {
    const values = [];

    attachments.map((attach) => {
      var str = `(${body.center_id},${`'${baseUrl}/${attach.path}'`})`;
      // //debugger;
      values.push(cleanUrl(str));
    });
    db.query(
      `insert into center_ads(center_id,attachment) values ${values.join(
        ","
      )} `,
      [],
      (error, results, fields) => {
        if (error) {
          callback(error);
        }
        return callback(null, results || null);
      }
    );
  },
  updateCenterById: (body, id, callback) => {
    delete body["id"];
    const data = [];
    Object.keys(body).map((key) => {
      if (key != "id") data.push(`${key}=?`);
    });

    db.query(
      `update centers set ${data.join(", ")} where id=?`,
      [...Object.values(body), id],
      (error, results, fields) => {
        if (error) {
          callback(error);
        }
        return callback(null, results);
      }
    );
  },
  deleteCenters: (id, callback) => {
    db.query(
      `delete from centers where id=?`,
      [id],
      (error, results, fields) => {
        if (error) {
          callback(error);
        }
        return callback(null, results || null);
      }
    );
  },
  getCentersAds: (centerId, callback) => {
    db.query(
      `select * from center_ads where center_id=?`,
      [centerId],
      (error, results, fields) => {
        if (error) {
          callback(error);
        }
        return callback(null, results || null);
      }
    );
  },
  deleteCentersAds: (id, callback) => {
    db.query(
      `delete from center_ads where id=?`,
      [id],
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
  addNews: (data, attachments, callback) => {
    db.query(
      `insert into news(messageHeader,messageDetail,center,attachments) values(?,?,?,?)`,
      [
        data.messageHeader,
        data.messageDetail,
        data.center,
        attachments.join("|") || "",
      ],
      (error, results, fields) => {
        if (error) {
          callback(error);
        }
        return callback(null, results);
      }
    );
  },
  getFcmTokens: (center, callback) => {
    var where = " WHERE city=?";
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

  uploadData: (data, table) =>
    new Promise(async (resolve, reject) => {
      db.query(`delete from ${table}`, [], async (error, results, fields) => {
        if (error) {
          reject(error);
        } else {
          var length = data.length || 0;
          var rowsAffected = 0;
          var parts = [];
          var count = 10000;
          var pages = Math.floor(length / count);
          for (var i = 0; i <= pages; i++) {
            var partArray = data.slice(i * 100, i * 100 + count);
            parts.push(partArray);
          }
          await Promise.all(
            parts.map(async (partData) => {
              if (partData.length) await insertRows(partData, table);
            })
          );
          resolve(true);
        }
      });
    }),
  uploadPISData: (data, table) =>
    new Promise(async (resolve, reject) => {
      await insertRowsPIS(data, table);
      resolve(true);
    }),

  generateLicences: (count, batch_id, callback) => {
    const licenseGen = require("@mcnaveen/license-gen");
    // const { count = 0 } = params;
    const errors = [];
    let rowCount = 0;
    for (var i = 0; i < count; i++) {
      const key = licenseGen(16);
      db.query(
        `insert into valid_keys(reg_key,batch_id) values(?,?)`,
        [key, batch_id],
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
  addKeysBatch: (data, batch_id, callback) => {
    db.query(
      `insert into keys_batch(batch_id,batch_name,printed_status) values(?,?,?)`,
      [batch_id, data.batch_name, data.printed_status],
      (error, results, fields) => {
        if (error) {
          callback(error);
        }
        return callback(null, results);
      }
    );
  },
  deleteBatch: (id, callback) => {
    db.query(
      `delete from keys_batch where id=?`,
      [id],
      (error, results, fields) => {
        if (error) {
          callback(error);
        }
        return callback(null, results || null);
      }
    );
  },
};
