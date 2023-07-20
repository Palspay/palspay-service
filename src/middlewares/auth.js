const jwt = require('jsonwebtoken');
const userService = require('../services/user.service');
const config = require('../config/config');
const httpStatus = require('http-status');
const ApiError = require('../utills/ApiError');
const { getCurrentDateTime } = require('./../constants/constant');
const auth = async (req, res, next) => {
    try {
        const token = req.headers['authorization'];
        const decoded = jwt.verify(token, config.jwt.public_key, { algorithms: ['RS256'] });
        const user = await userService.getUserById({ _id: decoded.userId });
        if (!user) {
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid Token');
        }
        req.userId = user._id;
        req.email = user.email;

        req.currentDate = await getCurrentDateTime();
        next();
    } catch (error) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal server error');
    }
}
module.exports = auth;
