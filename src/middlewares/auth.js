const jwt = require('jsonwebtoken');
const userService = require('../services/user.service');
const config = require('../config/config');
const httpStatus = require('http-status');
const ApiError = require('../utills/ApiError');
const { getCurrentDateTime } = require('./../constants/constant');
// @ts-ignore
const auth = async (req, res, next) => {
    try {
        const token = req.headers['authorization'];
        const decoded = jwt.verify(token, config.jwt.public_key, { algorithms: ['RS256'] });
        // @ts-ignore
        const user = await userService.getUserById({ _id: decoded.userId });
        if (!user) {
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid Token');
        }
        req.userId = user._id;
        req.email = user.email;
        req.currentDate = await getCurrentDateTime();
        next();
    } catch (error) {
        next(new ApiError(httpStatus.UNAUTHORIZED, 'Invalid Token'));
    }
}

// @ts-ignore
const authAdmin = async (req, res, next) => {
    try {
        const token = req.headers['authorization'];
        const decoded = jwt.verify(token, config.jwt.public_key, { algorithms: ['RS256'] });
        // @ts-ignore
        const user = await userService.getUserById({ _id: decoded.userId });
        if (!user && user.user_type !== 'ADMIN') {
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid Token');
        }
        req.userId = user._id;
        req.email = user.email;

        req.currentDate = await getCurrentDateTime();
        next();
    } catch (error) {
        next(new ApiError(httpStatus.UNAUTHORIZED, 'Invalid Token'));
    }
}

const authGroupOwner = async (req, res, next) => {
    try {
        const groupId = req.params.group_id;
        const groupDetails = await userService.getGroupDetails(groupId);
        // @ts-ignore
        if (!groupDetails || !groupDetails.group_owner || !req.userId.id.equals(groupDetails.group_owner.id)) {
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid Token');
        }
        next();
    } catch (error) {
        next(new ApiError(httpStatus.UNAUTHORIZED, 'Invalid Token'));
    }
}
module.exports = {
    auth, authAdmin, authGroupOwner
};
