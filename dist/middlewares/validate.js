"use strict";
var Joi = require('joi');
var httpStatus = require('http-status');
var pick = require('../utills/pick');
var ApiError = require('../utills/ApiError');
var validate = function (schema) { return function (req, res, next) {
    var validSchema = pick(schema, ['params', 'query', 'body']);
    var object = pick(req, Object.keys(validSchema));
    var _a = Joi.compile(validSchema)
        .prefs({ errors: { label: 'key' }, abortEarly: false })
        .validate(object), value = _a.value, error = _a.error;
    if (error) {
        var errorMessage = error.details.map(function (details) { return details.message; }).join(', ');
        return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
    }
    Object.assign(req, value);
    return next();
}; };
module.exports = validate;
//# sourceMappingURL=validate.js.map