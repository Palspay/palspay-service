const jwt = require('jsonwebtoken');
const userService = require('../services/user.service');
const config = require('../config/config');
const httpStatus = require('http-status');
const ApiError = require('../utills/ApiError');
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
        const options = {
            timeZone: 'Asia/Kolkata',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        };
        const currentDate = new Date().toLocaleString('en-US', options);
        req.currentDate = currentDate;
        next();
    } catch (error) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal server error');
    }
}
module.exports = auth;
