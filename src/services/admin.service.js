const httpStatus = require('http-status');
const ApiError = require('../utills/ApiError');
const mongoose = require('mongoose');
const Plans=require('./../models/plan.model');


const createPlans = async (groupData) => {
    console.log('hello');
    try {
        groupData['created_by'] = groupData.userId;
        groupData['creation_date'] = groupData.currentDate;
        const plans = new Plans(groupData);
        return await plans.save();
    } catch (error) {
        if (error instanceof ApiError) {
            throw error; // Re-throw the ApiError
        } else {
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
        }
    }

}

module.exports = {
    createPlans
};
