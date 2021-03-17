const router = require('express').Router();
const { login, createUser } = require('../controllers/users');
const { checkRegister, checkLogin } = require('../middleware/validators/validateUsers');

router.post('/signup', checkRegister, createUser);
router.post('/signin', checkLogin, login);

module.exports = router;
