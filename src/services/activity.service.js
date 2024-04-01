const httpStatus = require('http-status');
const ApiError = require('../utills/ApiError');
const User = require('../models/user.model');
const config = require('../config/config');
const mongoose = require('mongoose');
const moment = require('moment-timezone');
const Activity = require('../models/activity.model');

const createActivity = async (expanseData) => {
    try {
        const activity = new Activity(expanseData);
        return await activity.save();
    } catch (error) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
    }
};

const getActivity = async (userId) => {
    return Activity.find({user_id:userId}).select({description:-1});
};

module.exports = {
    createActivity,
    getActivity
};
