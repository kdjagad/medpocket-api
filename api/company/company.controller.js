require("dotenv").config();
const {
  searchCompany,
  searchCompanyToStockiest,
  searchStockiestToCompany,
} = require("./company.service");

const groupAndAdd = (arr, column) => {
  const res = [];
  arr.forEach((el) => {
    if (!this[el[column]]) {
      this[el[column]] = {
        name: el[column],
        childrens: [],
      };
      res.push(this[el[column]]);
    }
    this[el[column]].childrens.push(el);
  }, {});
  return res;
};

module.exports = {
  searchCompany: async (req, res) => {
    try {
      searchCompany(req.body.query, async (error, response) => {
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
  searchCompanyToStockiest: async (req, res) => {
    try {
      searchCompanyToStockiest(
        req.params.query,
        req.user,
        true,
        async (error, response) => {
          response = response ? JSON.parse(JSON.stringify(response)) : null;
          if (response) {
            res
              .status(200)
              .json({ status: 1, message: "success", data: response });
          } else {
            res.status(500).json({ status: 0, message: error });
          }
        }
      );
    } catch (error) {
      res.status(500).json({ status: 0, message: error });
    }
  },
  searchCompanyToStockiestSearch: async (req, res) => {
    try {
      searchCompanyToStockiest(
        req.params.company,
        req.user,
        false,
        async (error, response) => {
          response = response ? JSON.parse(JSON.stringify(response)) : null;
          if (response) {
            res
              .status(200)
              .json({ status: 1, message: "success", data: response });
          } else {
            res.status(500).json({ status: 0, message: error });
          }
        }
      );
    } catch (error) {
      res.status(500).json({ status: 0, message: error });
    }
  },
  searchStockiestToCompany: async (req, res) => {
    try {
      searchStockiestToCompany(
        req.params.query,
        req.user,
        true,
        async (error, response) => {
          response = response ? JSON.parse(JSON.stringify(response)) : null;
          if (response) {
            res
              .status(200)
              .json({ status: 1, message: "success", data: response });
          } else {
            res.status(500).json({ status: 0, message: error });
          }
        }
      );
    } catch (error) {
      res.status(500).json({ status: 0, message: error });
    }
  },
  searchStockiestToCompanySearch: async (req, res) => {
    try {
      searchStockiestToCompany(
        req.params.query,
        req.user,
        false,
        async (error, response) => {
          response = response ? JSON.parse(JSON.stringify(response)) : null;
          if (response) {
            res
              .status(200)
              .json({ status: 1, message: "success", data: response });
          } else {
            res.status(500).json({ status: 0, message: error });
          }
        }
      );
    } catch (error) {
      res.status(500).json({ status: 0, message: error });
    }
  },
};
