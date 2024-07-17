"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleLogin = exports.createPassword = exports.verifyUser = exports.verifyOtp = exports.login = exports.register = void 0;
var joi_1 = __importDefault(require("joi"));
var custom_validations_1 = require("./custom.validations");
exports.register = {
    body: joi_1.default.object().keys({
        email: joi_1.default.string().required().email(),
        password: joi_1.default.string().required().custom(custom_validations_1.password),
        name: joi_1.default.string().required(),
        mobile: joi_1.default.string().required(),
        user_type: joi_1.default.string().optional(),
        vpa: joi_1.default.string().optional()
    }),
};
exports.login = {
    body: joi_1.default.object().keys({
        email: joi_1.default.string().required().email(),
        password: joi_1.default.string().required().custom(custom_validations_1.password),
    }),
};
exports.verifyOtp = {
    body: joi_1.default.object().keys({
        userId: joi_1.default.string().required(),
        otp: joi_1.default.string().required().custom(custom_validations_1.otp_length),
    }),
};
exports.verifyUser = {
    body: joi_1.default.object().keys({
        mobile: joi_1.default.string().required(),
    }),
};
exports.createPassword = {
    body: joi_1.default.object().keys({
        newPassword: joi_1.default.string().required().custom(custom_validations_1.password),
        confirmPassword: joi_1.default.string().required().custom(custom_validations_1.password),
    }),
};
exports.googleLogin = {
    body: joi_1.default.object().keys({
        token: joi_1.default.string().required(),
    })
};
//# sourceMappingURL=auth.validations.js.map