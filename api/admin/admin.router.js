const { verifyToken } = require("../../config/hooks");
const {
  login,
  getUsers,
  updateProfile,
  getStockiestRequest,
  getUserById,
  uploadCrossReference,
} = require("./admin.controller");

const router = require("express").Router();
router.post("/login", login);
router.get("/users", verifyToken, getUsers);
router.get("/users/:userId", verifyToken, getUserById);
router.get("/users/stockiest", verifyToken, getStockiestRequest);
router.post("/users/:userId", verifyToken, updateProfile);
router.post("/crossref", verifyToken, uploadCrossReference);

module.exports = router;
