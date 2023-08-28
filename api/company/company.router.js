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
router.get("/search/:query(*)", verifyToken, searchCompany);
router.get("/company-to-stockiest/:query(*)", verifyToken, companyToStockiest);
router.get(
  "/stockiest-from-company/:query(*)",
  verifyToken,
  stockestFromCompany
);
router.get("/stockiest-to-company/:query(*)", verifyToken, stockiestToCompany);
router.get(
  "/company-from-stockiest/:query(*)",
  verifyToken,
  companyFromStockiest
);
router.get(
  "/stockiest-details/:stockiest(*)",
  verifyToken,
  getStockiestDetails
);

module.exports = router;
