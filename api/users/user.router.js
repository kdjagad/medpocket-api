const { login, register, verify } = require('./user.controller');

const router = require('express').Router();

router.post('/', (req, res) => {
    res.status(200).json({ "status": 1, "message": 'user fetched' });
});
router.post('/login', login);
router.post('/register', register);
router.post('/verify', verify);

module.exports = router;