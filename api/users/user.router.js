const { login, register, verify, getProfile, updateProfile } = require('./user.controller');
const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        console.log(err)

        if (err) return res.sendStatus(403)

        req.user = user

        next()
    })
}

const router = require('express').Router();

router.get('/', verifyToken, (req, res) => {
    res.status(200).json({ "status": 1, "message": 'user fetched 123' });
});
router.post('/login', login);
router.post('/register', register);
router.post('/verify', verify);
router.get('/profile', verifyToken, getProfile);
router.post('/profile', verifyToken, updateProfile);

module.exports = router;