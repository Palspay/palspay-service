const Joi = require('joi');
const { password ,otp_length} = require('./custom.validations');

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

const verifyOtp={
  body: Joi.object().keys({
    userId: Joi.string().required(),
    otp: Joi.number().required().custom(otp_length),
  }),
}
module.exports = {
  register,
  login,
  verifyOtp
};