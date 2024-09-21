import Joi from 'joi';
import { password, otp_length } from './custom.validations';

export const register = {
    body: Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().required().custom(password),
        name: Joi.string().required(),
        mobile: Joi.string().required(),
        user_type:Joi.string().optional(),
        vpa:Joi.string().optional()
    }),
};
export const login = {
    body: Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().required().custom(password),
    }),
};

export const verifyOtp = {
    body: Joi.object().keys({
        userId: Joi.string().required(),
        otp: Joi.string().required().custom(otp_length),
        callFrom: Joi.string().optional().valid('PassWordReset', 'register'), // Add callFrom field
    }),
}
export const verifyUser = {
    body: Joi.object().keys({
        mobile: Joi.string().required(),
    }),
}

export const createPassword = {
    body: Joi.object().keys({
        newPassword: Joi.string().required().custom(password),
        confirmPassword: Joi.string().required().custom(password),
        userId: Joi.string().required(),
    }),
}

export const googleLogin = {
    body: Joi.object().keys({
        token: Joi.string().required(),
    })
}
