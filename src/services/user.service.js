const httpStatus = require('http-status');
const ApiError = require('../utills/ApiError');
const User = require('../models/user.model');
const { v4: uuidv4 } = require('uuid');
const config = require('../config/config');
const Friends = require('../models/friends.model');
const mongoose=require('mongoose');
/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
    return User.findOne({ email, is_deleted: false });
};

const getUserById = async (userId) => {
    return User.findOne({ _id: userId, is_deleted: false });
}

const getUserByMobile = async (mobile) => {
    return User.findOne({ mobile, is_deleted: false });
}

const getFriendsById = async (userId) => {
    console.log(userId);
    const friendsList = await Friends.aggregate([
        {
          $match: { user_id:userId, status: true }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'friend_id',
            foreignField: '_id',
            as: 'friend'
          }
        },
        {
            $unwind: '$friend'
          },
          {
            $replaceRoot: {
              newRoot: '$friend'
            }
          },
          {
            $project: {
              _id: 1,
              name: 1,
              mobile: 1,
            }
          }
      ]).exec();
            
    if (friendsList.length === 0) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Data Not Found');
    }
    return friendsList;
}
const addFriends = async (userData) => {
    const isExits = await getUserByMobile(userData.mobile);
    if (isExits) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Bad Request');
    }
    const token = uuidv4().substring(0, 8);
    const inviteLink = config.invite_url + userData.mobile.slice(0, 2) + token + userData.mobile.slice(2, 4);
    userData['invite_token'] = inviteLink;
    userData['is_registered'] = true;
    const user = new User(userData);
    const friends_id = await user.save();
    const payload = {
        friend_id: friends_id._id,
        user_id: userData.userId,
        creation_date: userData.currentDate,
        modification_date: userData.currentDate,
        created_by: userData.userId,
        modified_by: userData.userId
    }
    const friend_relation = new Friends(payload);
    return await friend_relation.save();
}
module.exports = {
    getUserByEmail,
    getUserById,
    addFriends,
    getUserByMobile,
    getFriendsById
};