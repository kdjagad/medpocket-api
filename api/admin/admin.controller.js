const {
  getUsers,
  login,
  getUserById,
  updateUserById,
  getKeys,
  getNews,
  getCenters,
  addNews,
  getFcmTokens,
  sendPushNotification,
} = require("./admin.service");

require("dotenv").config();
const jwt = require("jsonwebtoken");
var CryptoJS = require("crypto-js");
const readXlsxFile = require("read-excel-file/node");
module.exports = {
  login: async (req, res) => {
    try {
      login(
        req.body.username,
        CryptoJS.MD5(req.body.password).toString(),
        async (error, response) => {
          response = response ? JSON.parse(JSON.stringify(response)) : null;
          if (response) {
            jwt.sign(response[0], process.env.JWT_SECRET, (err, token) => {
              res.status(200).json({
                status: 1,
                message: "success",
                data: response,
                token: token,
              });
            });
            // res
            //   .status(200)
            //   .json({ status: 1, message: "success", data: response });
          } else {
            res.status(500).json({ status: 0, message: error });
          }
        }
      );
    } catch (error) {
      res.status(500).json({ status: 0, message: error });
    }
  },
  getUsers: async (req, res) => {
    try {
      getUsers(false, async (error, response) => {
        response = response ? JSON.parse(JSON.stringify(response)) : null;
        if (response) {
          res
            .status(200)
            .json({ status: 1, message: "success", data: response });
        } else {
          res.status(500).json({ status: 0, message: error });
        }
      });
    } catch (error) {
      res.status(500).json({ status: 0, message: error });
    }
  },
  getKeys: async (req, res) => {
    try {
      getKeys(async (error, response) => {
        response = response ? JSON.parse(JSON.stringify(response)) : null;
        if (response) {
          res
            .status(200)
            .json({ status: 1, message: "success", data: response });
        } else {
          res.status(500).json({ status: 0, message: error });
        }
      });
    } catch (error) {
      res.status(500).json({ status: 0, message: error });
    }
  },
  getNews: async (req, res) => {
    try {
      getNews(async (error, response) => {
        response = response ? JSON.parse(JSON.stringify(response)) : null;
        if (response) {
          res
            .status(200)
            .json({ status: 1, message: "success", data: response });
        } else {
          res.status(500).json({ status: 0, message: error });
        }
      });
    } catch (error) {
      res.status(500).json({ status: 0, message: error });
    }
  },
  getCenters: async (req, res) => {
    try {
      getCenters(async (error, response) => {
        response = response ? JSON.parse(JSON.stringify(response)) : null;
        if (response) {
          res
            .status(200)
            .json({ status: 1, message: "success", data: response });
        } else {
          res.status(500).json({ status: 0, message: error });
        }
      });
    } catch (error) {
      res.status(500).json({ status: 0, message: error });
    }
  },
  getUserById: async (req, res) => {
    try {
      getUserById(req.params.userId, async (error, response) => {
        response = JSON.parse(JSON.stringify(response));
        res.status(200).json({ status: 1, message: "success", data: response });
      });
    } catch (error) {
      res.status(500).json({ status: 0, message: error });
    }
  },
  getStockiestRequest: async (req, res) => {
    try {
      getUsers(true, async (error, response) => {
        response = response ? JSON.parse(JSON.stringify(response)) : null;
        if (response) {
          res
            .status(200)
            .json({ status: 1, message: "success", data: response });
        } else {
          res.status(500).json({ status: 0, message: error });
        }
      });
    } catch (error) {
      res.status(500).json({ status: 0, message: error });
    }
  },
  updateProfile: async (req, res) => {
    const body = req.body;
    const { userId = 0 } = req.params;
    try {
      updateUserById(body, userId, async (error) => {
        if (error) {
          res.status(200).json({ status: 0, message: "fail", data: null });
        } else {
          res.status(200).json({ status: 1, message: "success", data: null });
        }
      });
    } catch (error) {
      res.status(500).json({ status: 0, message: error });
    }
  },
  uploadCrossReference: async (req, res) => {
    //debugger;
    const file = req.files;
    try {
      readXlsxFile(file).then((rows) => console.log("rows", rows));
      // updateUserById(body, userId, async (error) => {
      //   if (error) {
      //     res.status(200).json({ status: 0, message: "fail", data: null });
      //   } else {
      //     res.status(200).json({ status: 1, message: "success", data: null });
      //   }
      // });
    } catch (error) {
      res.status(500).json({ status: 0, message: error });
    }
  },
  postNews: async (req, res) => {
    const body = req.body;
    try {
      addNews(body, async (error) => {
        if (error) {
          res.status(500).json({ status: 0, message: "fail", data: null });
        } else {
          getFcmTokens(body.center, async (err, resp) => {
            if (!err) {
              sendPushNotification(
                resp,
                body.messageHeader,
                body.messageDetail,
                async (er, response) => {
                  if (er) res.status(500).json({ status: 0, message: er });
                  else
                    res
                      .status(200)
                      .json({ status: 1, message: "success", data: null });
                }
              );
            } else {
              res.status(500).json({ status: 0, message: err });
            }
          });
        }
      });
    } catch (error) {
      res.status(500).json({ status: 0, message: error });
    }
  },
};
