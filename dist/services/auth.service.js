"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var httpStatus = require('http-status');
var ApiError = require('../utills/ApiError');
var User = require('../models/user.model');
var userService = require('./user.service');
var config = require('../config/config');
// @ts-ignore
var jwt = require('jsonwebtoken');
// @ts-ignore
var bcrypt = require('bcryptjs');
var getCurrentDateTime = require('./../constants/constant').getCurrentDateTime;
// @ts-ignore
var activityService = require('./activity.service');
/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
var createUser = function (userBody) { return __awaiter(void 0, void 0, void 0, function () {
    var isEmailExits, isTempReg, user, otp;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, userService.getUserByEmail(userBody.email)];
            case 1:
                isEmailExits = _a.sent();
                if (isEmailExits) {
                    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
                }
                return [4 /*yield*/, userService.getUserByMobile(userBody.mobile)];
            case 2:
                isTempReg = _a.sent();
                return [4 /*yield*/, generateOtp(6)];
            case 3:
                otp = _a.sent();
                if (!!isTempReg) return [3 /*break*/, 5];
                userBody['otp'] = otp;
                userBody['timezone'] = Intl.DateTimeFormat().resolvedOptions().timeZone;
                return [4 /*yield*/, User.create(userBody)];
            case 4:
                user = _a.sent();
                return [3 /*break*/, 8];
            case 5:
                if (!(isTempReg.is_temp_registered === false)) return [3 /*break*/, 6];
                throw new ApiError(httpStatus.BAD_REQUEST, 'Mobile number already registred');
            case 6:
                isTempReg.password = userBody.password;
                isTempReg.email = userBody.email;
                isTempReg.is_temp_registered = false;
                isTempReg.name = userBody.name;
                isTempReg.otp = otp;
                return [4 /*yield*/, isTempReg.save()];
            case 7:
                user = _a.sent();
                _a.label = 8;
            case 8: 
            // @ts-ignore
            return [2 /*return*/, { userId: user._id, otp: user.otp }];
        }
    });
}); };
var createUserWithoutOTP = function (userBody) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userBody['timezone'] = Intl.DateTimeFormat().resolvedOptions().timeZone;
                userBody['is_otp_verify'] = true;
                return [4 /*yield*/, User.create(userBody)];
            case 1:
                user = _a.sent();
                return [2 /*return*/, user];
        }
    });
}); };
var loginUserWithEmailAndPassword = function (userBody) { return __awaiter(void 0, void 0, void 0, function () {
    var user, matched;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, userService.getUserByEmail(userBody.email)];
            case 1:
                user = _b.sent();
                if (!user) {
                    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
                }
                return [4 /*yield*/, bcrypt.compare(userBody.password, user.password)];
            case 2:
                matched = _b.sent();
                if (!user || !matched) {
                    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
                }
                _a = {};
                return [4 /*yield*/, generateToken(user)];
            case 3: return [2 /*return*/, (_a.access_token = _b.sent(),
                    // @ts-ignore
                    _a.is_passcode_enter = user.is_passcode_enter,
                    // @ts-ignore
                    _a.email = user.email,
                    // @ts-ignore
                    _a.mobile_no = user.mobile_no,
                    _a.name = user.name,
                    // @ts-ignore
                    _a.user_id = user._id,
                    // @ts-ignore
                    _a.currency = user.currency || 'INR',
                    _a)];
        }
    });
}); };
/**
 * Generate a JWT token
 * @param {Object} user
 * @returns {Promise<string>} JWT token
 */
var generateToken = function (user) { return __awaiter(void 0, void 0, void 0, function () {
    var payload;
    return __generator(this, function (_a) {
        payload = {
            userId: user._id,
            email: user.email,
            iss: 'ISSUER',
            sub: 'SUBJECT',
        };
        return [2 /*return*/, jwt.sign(payload, config.jwt.private_key, { algorithm: 'RS256' })];
    });
}); };
var generateOtp = function (length) { return __awaiter(void 0, void 0, void 0, function () {
    var digits, OTP, i;
    return __generator(this, function (_a) {
        digits = '0123456789';
        OTP = '';
        for (i = 0; i < length; i++) {
            OTP += digits[Math.floor(Math.random() * 10)];
        }
        return [2 /*return*/, OTP];
    });
}); };
var verifyOtp = function (data) { return __awaiter(void 0, void 0, void 0, function () {
    var user, _a, users;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, userService.getUserById(data.userId)];
            case 1:
                user = _c.sent();
                if (!user || user.otp !== data.otp) {
                    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Otp');
                }
                if (user.is_otp_verify) {
                    throw new ApiError(httpStatus.BAD_REQUEST, 'Bad Request');
                }
                user.is_otp_verify = true;
                _a = user;
                return [4 /*yield*/, getCurrentDateTime()];
            case 2:
                _a.modification_date = _c.sent();
                return [4 /*yield*/, user.save()];
            case 3:
                users = _c.sent();
                _b = {};
                return [4 /*yield*/, generateToken(users)];
            case 4: return [2 /*return*/, (
                // @ts-ignore
                _b.access_token = _c.sent(),
                    _b.is_passcode_enter = users.is_passcode_enter,
                    _b.email = users.email,
                    _b.mobile_no = users.mobile_no,
                    _b.name = users.name,
                    _b.user_id = users._id,
                    _b.currency = users.currency || 'INR',
                    _b)];
        }
    });
}); };
var verifyUser = function (data) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, userService.verifyUser(data)];
            case 1:
                user = _a.sent();
                return [2 /*return*/, user];
        }
    });
}); };
var createNewPassword = function (data) { return __awaiter(void 0, void 0, void 0, function () {
    var isCreate;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, userService.createNewPassword(data)];
            case 1:
                isCreate = _b.sent();
                _a = {};
                return [4 /*yield*/, generateToken(isCreate)];
            case 2: return [2 /*return*/, (_a.access_token = _b.sent(), _a)];
        }
    });
}); };
module.exports = {
    createUser: createUser,
    createUserWithoutOTP: createUserWithoutOTP,
    generateToken: generateToken,
    loginUserWithEmailAndPassword: loginUserWithEmailAndPassword,
    verifyOtp: verifyOtp,
    verifyUser: verifyUser,
    createNewPassword: createNewPassword
};
//# sourceMappingURL=auth.service.js.map