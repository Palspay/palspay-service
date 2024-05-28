const Joi = require('joi');
const { password, otp_length } = require('./custom.validations');

const register = {
    body: Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().required().custom(password),
        name: Joi.string().required(),
        mobile: Joi.string().required(),
        user_type:Joi.string().optional()
    }),
};
const login = {
    body: Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().required().custom(password),
    }),
};

const verifyOtp = {
    body: Joi.object().keys({
        userId: Joi.string().required(),
        otp: Joi.string().required().custom(otp_length),
    }),
}
const verifyUser = {
    body: Joi.object().keys({
        mobile: Joi.string().required(),
    }),
}

const createPassword = {
    body: Joi.object().keys({
        newPassword: Joi.string().required().custom(password),
        confirmPassword: Joi.string().required().custom(password),
    }),
}

module.exports = {
    register,
    login,
    verifyOtp,
    verifyUser,
    createPassword
};