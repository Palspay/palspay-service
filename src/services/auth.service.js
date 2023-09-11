const httpStatus = require('http-status');
const ApiError = require('../utills/ApiError');
const User = require('../models/user.model');
const userService = require('./user.service');
const config = require('../config/config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { getCurrentDateTime } = require('./../constants/constant');
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
    const otp = await generateOtp(6);
    if (!isTempReg) {
        userBody['otp'] = otp;
        userBody['timezone'] = Intl.DateTimeFormat().resolvedOptions().timeZone;

        // console.log(await userService.getCurrencyByTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone));
        // return
        user = await User.create(userBody);
    } else if (isTempReg.is_temp_registered === false) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Mobile number already registred');
    } else {
        isTempReg.password = userBody.password;
        isTempReg.email = userBody.email;
        isTempReg.is_temp_registered = false;
        isTempReg.name = userBody.name;
        isTempReg.otp = otp;
        user = await isTempReg.save();
    }
    return { userId: user._id, otp: user.otp };
};

const loginUserWithEmailAndPassword = async (userBody) => {
    const user = await userService.getUserByEmail(userBody.email);
<<<<<<< HEAD
    if (!user) {
=======
if (!user) {
>>>>>>> 39739719cb9c7e8afa26c2e4e70a2f54f9e3aa64
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
    }
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

const generateOtp = async (length) => {
    const digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < length; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}


const verifyOtp = async (data) => {
    const user = await userService.getUserById(data.userId);
    if (!user || user.otp !== data.otp) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Otp');
    }
    if (user.is_otp_verify) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Bad Request');
    }
    user.is_otp_verify = true;
    user.modification_date = await getCurrentDateTime();
    const users = await user.save();
    return { access_token: await generateToken(users), is_passcode_enter: users.is_passcode_enter };
}

const verifyUser = async (data) => {
    const user = await userService.verifyUser(data);
    return user;
}

const createNewPassword = async (data) => {
    const isCreate = await userService.createNewPassword(data);
    return { access_token: await generateToken(isCreate) };
}


module.exports = {
    createUser,
    generateToken,
    loginUserWithEmailAndPassword,
    verifyOtp,
    verifyUser,
    createNewPassword
};
