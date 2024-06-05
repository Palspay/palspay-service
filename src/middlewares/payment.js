const userService = require('../services/user.service');
const httpStatus = require('http-status');
const ApiError = require('../utills/ApiError');
const { getCurrentDateTime } = require('./../constants/constant');
const validateVPA = async (req, res, next) => {
    try {
        const user = await userService.getUserById({ _id: req.body.paidTo });
        if (!user.vpa) {
            throw new Error("VPA not set for receiver")
        }
        next();
    } catch (error) {
        next(new ApiError(httpStatus.UNAUTHORIZED, 'VPA not set for receiver'));
    }
}

module.exports = {
    validateVPA
};