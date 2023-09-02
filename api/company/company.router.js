const { verifyToken } = require("../../config/hooks");
const {
  searchCompany,
  companyToStockiest,
  stockestFromCompany,
  stockiestToCompany,
  companyFromStockiest,
  getStockiestDetails,
} = require("./company.controller");

const router = require("express").Router();
router.post("/search", verifyToken, searchCompany);
router.post("/company-to-stockiest", verifyToken, companyToStockiest);
router.post("/stockiest-from-company", verifyToken, stockestFromCompany);
router.post("/stockiest-to-company", verifyToken, stockiestToCompany);
router.post("/company-from-stockiest", verifyToken, companyFromStockiest);
router.post("/stockiest-details", verifyToken, getStockiestDetails);

module.exports = router;
