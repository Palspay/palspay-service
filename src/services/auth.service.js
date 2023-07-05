const httpStatus = require('http-status');
const ApiError = require('../utills/ApiError');
const User = require('../models/user.model');
const userService = require('./user.service');
const config = require('../config/config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
    const isEmailExits = await userService.getUserByEmail(userBody.email);
    if (isEmailExits) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }
    const isTempReg = await userService.getUserByMobile(userBody.mobile);
    let user;
    if (!isTempReg) {
        user = await User.create(userBody);
    }
    else if (isTempReg.is_temp_registered === false) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Mobile number already registred');
    } else {
        isTempReg.password = userBody.password;
        isTempReg.email = userBody.email;
        isTempReg.is_temp_registered = false;
        isTempReg.name = userBody.name;
        user = await isTempReg.save();
    }
    return await generateToken(user);
};

const loginUserWithEmailAndPassword = async (userBody) => {
    const user = await userService.getUserByEmail(userBody.email);
    const matched = await bcrypt.compare(userBody.password, user.password);
    if (!user || !matched) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
    }
    return await generateToken(user);
};


/**
 * Generate a JWT token
 * @param {Object} payload
 * @returns {string} JWT token
 */
const generateToken = async (user) => {
    const payload = {
        userId: user._id,
        email: user.email,
        iss: 'ISSUER',
        sub: 'SUBJECT',
    };
    return jwt.sign(payload, config.jwt.private_key, { algorithm: 'RS256' });
};

module.exports = {
    createUser,
    generateToken,
    loginUserWithEmailAndPassword
};
