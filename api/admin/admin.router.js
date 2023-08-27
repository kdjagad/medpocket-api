const { verifyToken } = require("../../config/hooks");
const { login, getUsers, updateProfile } = require("./admin.controller");

const router = require("express").Router();
router.post("/login", login);
router.get("/users", verifyToken, getUsers);
router.post("/users/:userId", verifyToken, updateProfile);

module.exports = router;
