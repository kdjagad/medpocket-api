const { login, getUsers } = require("./admin.controller");

const router = require("express").Router();
router.post("/login", login);
router.get("/users", getUsers);

module.exports = router;
