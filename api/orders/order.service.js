const db = require("../../config/db.config");

module.exports = {
  generateOrder: (user, callback) => {
    const orderID = Math.floor(Math.random() * 1000000000);

    db.query(
      `insert into order_details(order_id, user_id, product_id, stockiest_id, quantity) select ?, user_id, product_id, stockiest_id, quantity from cart where user_id=?`,
      [orderID, user.id],
      (error, results, fields) => {
        if (!error) {
          db.query(
            `insert into order_master(order_id,user_id,amount) values(?,?,(select sum(p.MRP * o.quantity) from order_details o left outer join products p on o.product_id=p.id where o.order_id=?))`,
            [orderID, user.id, orderID],
            (error, results, fields) => {
              if (!error) {
                db.query(
                  `delete from cart where user_id=?`,
                  [user.id],
                  (error, results, fields) => {
                    if (error) {
                      callback(error);
                    }
                    return callback(null, results || null);
                  }
                );
              }
            }
          );
        }
      }
    );
  },
  getOrders: (user, callback) => {
    db.query(
      `select o.*,osm.Desc as txtStatus from order_master o left outer join order_status_master osm on o.status=osm.id where o.user_id=?`,
      [user.id],
      (error, results, fields) => {
        if (error) {
          callback(error);
        }
        return callback(null, results || null);
      }
    );
  },
  getOrderById: (orderId, callback) => {
    db.query(
      `select o.*,p.*,s.*,s.id as stockiest_id from order_details o left outer join products p on p.ID=o.product_id left outer join stockiests s on s.id=o.stockiest_id where o.order_id=?`,
      [orderId],
      (error, results, fields) => {
        if (error) {
          callback(error);
        }
        return callback(null, results || null);
      }
    );
  },
};
