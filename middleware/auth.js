const jwt = require('jsonwebtoken');
const { UnautorizedErr } = require('../errors/index');

const { NODE_ENV, JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnautorizedErr('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    throw new UnautorizedErr('Необходима авторизация');
  }

  req.user = payload;
  next();

  return true;
};

module.exports = { auth };
