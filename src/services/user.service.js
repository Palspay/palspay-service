const httpStatus = require('http-status');
const ApiError = require('../utills/ApiError');
const User = require('../models/user.model');
const { v4: uuidv4 } = require('uuid');
const config = require('../config/config');
const Friends = require('../models/friends.model');
const mongoose = require('mongoose');
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
    const friendsList = await User.aggregate([
        {
            $match: { _id: userId }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'friends',
                foreignField: '_id',
                as: 'friendsList'
            }
        },
        {
            $unwind: '$friendsList'
        },
        {
            $replaceRoot: {
                newRoot: '$friendsList'
            }
        },
        {
            $project: {
                _id: 1,
                name: 1,
                mobile: 1,
            }
        }
    ]);
    if (friendsList.length === 0) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Data Not Found');
    }
    return friendsList;
}
async function areFriends(userId) {
    const user1 = await User.findOne({ _id: userId }).populate('friends').exec();
    const user1Friends = user1.friends.map(friend => friend._id.toString());
    return user1Friends;
}
const addFriends = async (userData) => {
    try {
        const isExits = await getUserByMobile(userData.mobile);
        const token = uuidv4().substring(0, 8);
        const inviteLink = config.invite_url + userData.mobile.slice(0, 2) + token + userData.mobile.slice(2, 4);
        if (isExits) {
            const isFriend = await areFriends(userData.userId);
            if (isFriend.length !== 0 && isFriend.includes(isExits._id.toString())) {
                throw new ApiError(httpStatus.BAD_REQUEST, 'Already friends');
            }
            return await Promise.all([
                User.findByIdAndUpdate(userData.userId, { $addToSet: { friends: isExits._id } }),
                User.findByIdAndUpdate(isExits._id, { $addToSet: { friends: userData.userId } })]);

        }
        userData['invite_token'] = inviteLink;
        userData['is_temp_registered'] = true;
        const user = new User(userData);
        const friends_id = await user.save();
        return await Promise.all([User.findByIdAndUpdate(userData.userId, { $addToSet: { friends: friends_id._id } }),
        User.findByIdAndUpdate(friends_id._id, { $addToSet: { friends: userData.userId } })]);

    } catch (error) {
        console.error(error);

        if (error instanceof ApiError) {
            throw error; // Re-throw the ApiError
        } else {
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
        }
    }
}

module.exports = {
    getUserByEmail,
    getUserById,
    addFriends,
    getUserByMobile,
    getFriendsById
};