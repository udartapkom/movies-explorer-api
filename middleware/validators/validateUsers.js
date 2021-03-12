const { celebrate, Joi } = require('celebrate');

const checkLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const checkRegister = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().pattern(/^[A-Za-z0-9]/i),
    name: Joi.string().min(2).max(30),
  }),
});

module.exports = {
  checkLogin,
  checkRegister,
};
