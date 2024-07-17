"use strict";
var mongoose = require('mongoose');
var httpStatus = require('http-status');
var config = require('../config/config');
var logger = require('../config/logger');
var ApiError = require('./../utills/ApiError');
var errorConverter = function (err, req, res, next) {
    var error = err;
    if (!(error instanceof ApiError)) {
        var statusCode = error.statusCode || error instanceof mongoose.Error ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR;
        var message = error.message || httpStatus[statusCode];
        error = new ApiError(statusCode, message, {}, err.stack);
    }
    next(error);
};
// eslint-disable-next-line no-unused-vars
var errorHandler = function (err, req, res, next) {
    var statusCode = err.statusCode, message = err.message, data = err.data;
    if (config.env === 'production' && !err.isOperational) {
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
    }
    var response = {
        message: message,
        data: data
    };
    logger.error(err);
    res.status(statusCode).send(response);
};
module.exports = {
    errorConverter: errorConverter,
    errorHandler: errorHandler,
};
//# sourceMappingURL=error.js.map