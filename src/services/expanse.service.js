const httpStatus = require('http-status');
const ApiError = require('../utills/ApiError');
const User = require('../models/user.model');
const { v4: uuidv4 } = require('uuid');
const config = require('../config/config');
const Expanse = require('../models/expanse.model');
const mongoose = require('mongoose');

const createExpanse = async(expanseData) => {
    try {
        expanseData['userId'] = expanseData.userId;
        const expanse = new Expanse(expanseData);
        return await expanse.save();
    } catch (error) {
        if (error instanceof ApiError) {
            throw error; // Re-throw the ApiError
        } else {
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
        }
    }

}
module.exports = {
    createExpanse
};