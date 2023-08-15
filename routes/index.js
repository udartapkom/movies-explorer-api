const router = require('express').Router();
const { auth } = require('../middleware/auth');
const { NotFoundErr } = require('../errors/index');

const usersRoute = require('./user');
const moviesRoute = require('./movie');
const authRoute = require('./auth');

router.use('/users', auth, usersRoute);
router.use('/movies', auth, moviesRoute);
router.use('/', authRoute);
router.use('*', auth, () => {
  throw new NotFoundErr('Данные не найдены');
});

module.exports = router;
