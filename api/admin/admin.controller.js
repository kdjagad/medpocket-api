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
  getCentersAds,
  deleteCentersAds,
  getCenterById,
  createCenter,
  updateCenterById,
  deleteCenters,
  postCenterAds,
  uploadData,
} = require("./admin.service");

require("dotenv").config();
const jwt = require("jsonwebtoken");
var CryptoJS = require("crypto-js");
// const readXlsxFile = require("read-excel-file/node");
const reader = require("xlsx");

function cleanUrl(url) {
  return url.replace(/\\/g, "/");
}

function filterArray(arr) {
  var rArray = [];

  arr.map((ar) => {
    for (key in ar) {
      if (ar.hasOwnProperty(key) && key.toLowerCase().includes("empty")) {
        delete ar[key];
      }
    }
    rArray.push(ar);
  });

  debugger;
  return rArray;
}

module.exports = {
  login: async (req, res) => {
    try {
      login(
        req.body.username,
        CryptoJS.MD5(req.body.password).toString(),
        async (error, response) => {
          response = response ? JSON.parse(JSON.stringify(response)) : null;
          console.log("resp", response);
          if (response.length) {
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
  getCenterById: async (req, res) => {
    try {
      getCenterById(req.params.id, async (error, response) => {
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
  createCenter: async (req, res) => {
    let { body = {} } = req;
    let { header = [], newslogo = [] } = req.files;
    if (header.length)
      body["header"] = `${req.protocol}://${req.get("host")}/${header[0].path}`;
    if (newslogo.length)
      body["newslogo"] = `${req.protocol}://${req.get("host")}/${
        newslogo[0].path
      }`;
    try {
      createCenter(body, async (error, response) => {
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
  postCenterAds: async (req, res) => {
    let { body = {} } = req;
    let { centerAds = [] } = req.files;
    var baseUrl = `${req.protocol}://${req.get("host")}`;
    // //debugger;
    try {
      postCenterAds(body, centerAds, baseUrl, async (error, response) => {
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
  updateCenterById: async (req, res) => {
    let { body = {} } = req;
    let { header = [], newslogo = [] } = req.files;
    if (header.length)
      body["header"] = `${req.protocol}://${req.get("host")}/${header[0].path}`;
    if (newslogo.length)
      body["newslogo"] = `${req.protocol}://${req.get("host")}/${
        newslogo[0].path
      }`;
    try {
      updateCenterById(body, req.params.id, async (error, response) => {
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
  deleteCenter: async (req, res) => {
    try {
      deleteCenters(req.params.id, async (error, response) => {
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
  getCentersAds: async (req, res) => {
    try {
      getCentersAds(req.params.centerId, async (error, response) => {
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
  deleteCentersAds: async (req, res) => {
    try {
      deleteCentersAds(req.params.id, async (error, response) => {
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

  postNews: async (req, res) => {
    const body = req.body;
    const files = [];
    req.files.length &&
      req.files.map((attach) =>
        files.push(`${req.protocol}://${req.get("host")}/${attach.path}`)
      );

    try {
      addNews(body, files, async (error) => {
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
  uploadDataSheet: async (req, res) => {
    debugger;
    const file = req.files["file"][0];

    try {
      const { path = "" } = file;
      const excelFile = reader.readFile(path);
      const sheets = excelFile.SheetNames;
      if (
        sheets.includes("CROSSREFERENCE") &&
        sheets.includes("STOCKIST") &&
        sheets.includes("CHEMISTS_DRUGGISTS")
      ) {
        // if (sheets.includes("CROSSREFERENCE")) {
        var successMessage = [];
        await Promise.all(
          sheets.map(async (sheet) => {
            switch (sheet) {
              case "CROSSREFERENCE":
                debugger;
                let rows = reader.utils.sheet_to_json(
                  excelFile.Sheets["CROSSREFERENCE"],
                  { defval: "" }
                );
                rows = filterArray(rows);
                const ress = await uploadData(rows, "crossreference");
                if (ress) successMessage.push("Cross Ref. Uploaded");
                break;
              case "STOCKIST":
                debugger;
                let rows1 = reader.utils.sheet_to_json(
                  excelFile.Sheets["STOCKIST"],
                  { defval: "", blankrows: false, skipHidden: true }
                );
                rows1 = filterArray(rows1);
                const ress1 = await uploadData(rows1, "stockiests");
                if (ress1) successMessage.push("Stockiests Uploaded");
                break;
              case "CHEMISTS_DRUGGISTS":
                debugger;
                let rows2 = reader.utils.sheet_to_json(
                  excelFile.Sheets["CHEMISTS_DRUGGISTS"],
                  { defval: "", blankrows: false, skipHidden: true }
                );
                rows2 = filterArray(rows2);
                const ress2 = await uploadData(rows2, "chemistsdruggiest");
                if (ress2) successMessage.push("Chemists & Druggiest Uploaded");
                break;

              default:
                break;
            }
          })
        );
        debugger;
        res.status(200).json({
          status: 1,
          message: successMessage.join(" | "),
          data: null,
        });
      } else {
        res.status(500).json({
          status: 0,
          message: "File not in the correct format",
          data: null,
        });
      }
    } catch (error) {
      res.status(500).json({ status: 0, message: error });
    }
  },
};
