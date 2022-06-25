const { login, register, verify } = require('./user.controller');

const router = require('express').Router();

router.get('/', (req, res) => {
    res.status(200).json({ "status": 1, "message": 'user fetched 123' });
});
router.post('/login', login);
router.post('/register', register);
router.post('/verify', verify);

module.exports = router;