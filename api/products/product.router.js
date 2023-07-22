const { verifyToken } = require("../../config/hooks");
const {
  searchProduct,
  searchProductByBrand,
  getProductById,
  addToCart,
  getCart,
  deleteCart,
} = require("./product.controller");

const router = require("express").Router();
router.post("/search", verifyToken, searchProduct);
router.post("/search-by-brand", verifyToken, searchProductByBrand);
router.get("/cart", verifyToken, getCart);
router.delete("/cart/:cartId", verifyToken, deleteCart);
router.post("/cart", verifyToken, addToCart);
router.get("/:productId", verifyToken, getProductById);

module.exports = router;
