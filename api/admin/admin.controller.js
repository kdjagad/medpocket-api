const { getUsers, login } = require("./admin.service");

require("dotenv").config();
const jwt = require("jsonwebtoken");
var CryptoJS = require("crypto-js");
const { updateUserById } = require("../users/user.service");

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
      getUsers(async (error, response) => {
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
};