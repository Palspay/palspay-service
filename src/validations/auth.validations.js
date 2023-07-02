const Joi = require('joi');
const { password } = require('./custom.validations');

const register = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
    mobile:Joi.string().required()
  }),
};
const login = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
  }),
};
module.exports = {
  register,
  login
};