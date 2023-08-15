const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { ERR_MSG } = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

const {
  BadRequestErr,
  ConflictErr,
  NotFoundErr,
} = require('../errors/index');

const createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new BadRequestErr(ERR_MSG.BAD_REQUEST);
  }
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => {
      User.findById(user._id)
        .then((data) => res.send(data));
    })
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        throw new ConflictErr(ERR_MSG.CONFLICT);
      } else if (err.name === 'ValidationError') {
        throw new BadRequestErr(ERR_MSG.BAD_REQUEST);
      } else {
        throw new Error(ERR_MSG.SERVER_ERROR);
      }
    })
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((data) => {
      if (!data) {
        throw new NotFoundErr(ERR_MSG.NOT_FOUND);
      }
      res.send(data);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId' || err.kind === 'CastError') {
        throw new BadRequestErr(ERR_MSG.BAD_REQUEST);
      } else if (err.statusCode === 404) {
        next(err);
      } else {
        throw new Error(ERR_MSG.SERVER_ERROR);
      }
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const id = req.user._id;
  const { name, email } = req.body;
  if (!name || !email) {
    throw new BadRequestErr(ERR_MSG.BAD_REQUEST);
  }
  User.findByIdAndUpdate(id, { name, email }, { new: true })
    .then((data) => {
      if (!data) {
        throw new NotFoundErr(ERR_MSG.NOT_FOUND);
      }
      res.send(data);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestErr(ERR_MSG.BAD_REQUEST));
      } else if (err.statusCode === 404) {
        next(err);
      } else if (err.kind === 'ObjectId' || err.kind === 'CastError') {
        next(new BadRequestErr(ERR_MSG.BAD_REQUEST));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch((err) => {
      next(err);
    });
};
module.exports = {
  createUser,
  getCurrentUser,
  updateUser,
  login,
};
