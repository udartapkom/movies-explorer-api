const router = require('express').Router();
const { auth } = require('../middleware/auth');

const usersRoute = require('./user');
const moviesRoute = require('./movie');
const authRoute = require('./auth');

router.use('/users', auth, usersRoute);
router.use('/movies', auth, moviesRoute);
router.use('/', authRoute);

module.exports = router;
