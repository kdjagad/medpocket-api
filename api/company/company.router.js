const { verifyToken } = require("../../config/hooks");
const {
  searchCompany,
  searchCompanyToStockiest,
  searchStockiestToCompany,
  searchCompanyToStockiestSearch,
  searchStockiestToCompanySearch,
} = require("./company.controller");

const router = require("express").Router();
router.post("/search", verifyToken, searchCompany);
router.get("/to-stockiest/:query", verifyToken, searchCompanyToStockiest);
router.get(
  "/to-stockiest/search/:company",
  verifyToken,
  searchCompanyToStockiestSearch
);
router.get("/from-stockiest/:query", verifyToken, searchStockiestToCompany);
router.get(
  "/from-stockiest/search/:query",
  verifyToken,
  searchStockiestToCompanySearch
);

module.exports = router;
