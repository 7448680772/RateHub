const router = require('express').Router();
const { signup, login, updatePassword } = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth');

router.post('/signup', signup);
router.post('/login', login);
router.put('/update-password', authenticate, updatePassword);

module.exports = router;