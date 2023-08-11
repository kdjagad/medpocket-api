const { verifyToken } = require("../../config/hooks");
const { getLicences, generateLicences } = require("./keyGenerator.controller");

const router = require("express").Router();
router.get("/", verifyToken, getLicences);
router.get("/:count", verifyToken, generateLicences);

module.exports = router;
