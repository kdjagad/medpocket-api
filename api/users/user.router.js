const { login, register, verify } = require('./user.controller');

const router = require('express').Router();

router.post('/login', login);
router.post('/register', register);
router.post('/verify', verify);

module.exports = router;