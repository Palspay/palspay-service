import jwt from 'jsonwebtoken';
import userService from '../services/user.service.js';
import config from '../config/config.js';
import httpStatus from 'http-status';
import ApiError from '../utills/ApiError.js';
import { getCurrentDateTime } from './../constants/constant.js';
export const auth = async (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        next(new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorised User'));
        // throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorised User');
    }
    const decoded = jwt.verify(token, config.jwt.public_key, { algorithms: ['RS256'] });
    const user = await userService.getUserById({ _id: decoded.userId });
    if (!user) {
        next(new ApiError(httpStatus.UNAUTHORIZED, 'Invalid Token'));
        // throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid Token');
    }
    req.userId = user._id;
    req.email = user.email;

    req.currentDate = await getCurrentDateTime();
    next();
}

export const authAdmin = async (req, res, next) => {
    const token = req.headers['authorization'];
    const decoded = jwt.verify(token, config.jwt.public_key, { algorithms: ['RS256'] });
    const user = await userService.getUserById({ _id: decoded.userId });
    if (!user && user.user_type !== 'ADMIN') {
        next(new ApiError(httpStatus.UNAUTHORIZED, 'Invalid Token'));
        // throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid Token');
    }
    req.userId = user._id;
    req.email = user.email;

    req.currentDate = await getCurrentDateTime();
    next();
}
