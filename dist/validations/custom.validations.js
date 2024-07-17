"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passcode = exports.otp_length = exports.password = exports.objectId = void 0;
var objectId = function (value, helpers) {
    if (!value.match(/^[0-9a-fA-F]{24}$/)) {
        return helpers.message('"{{#label}}" must be a valid mongo id');
    }
    return value;
};
exports.objectId = objectId;
var password = function (value, helpers) {
    if (value.length < 8) {
        return helpers.message('password must be at least 8 characters');
    }
    if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
        return helpers.message('password must contain at least 1 letter and 1 number');
    }
    return value;
};
exports.password = password;
var otp_length = function (value, helpers) {
    if (value.length < 6) {
        return helpers.message('otp must be at least 6 digits');
    }
    return value;
};
exports.otp_length = otp_length;
var passcode = function (value, helpers) {
    if (value.length < 6) {
        return helpers.message('Passcode must be at least 4 digits');
    }
    return value;
};
exports.passcode = passcode;
//# sourceMappingURL=custom.validations.js.map