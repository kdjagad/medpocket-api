const { verifyToken } = require("../../config/hooks");
const {
  generateOrder,
  getOrders,
  getOrderById,
} = require("./order.controller");

const router = require("express").Router();
router.get("/generate", verifyToken, generateOrder);
router.get("/", verifyToken, getOrders);
router.get("/:orderId", verifyToken, getOrderById);

module.exports = router;
