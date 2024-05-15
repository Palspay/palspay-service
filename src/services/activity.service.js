import httpStatus from 'http-status';
import ApiError from '../utills/ApiError.js';
import Activity from '../models/activity.model.js';

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

export default {
    createActivity,
    getActivity
};
