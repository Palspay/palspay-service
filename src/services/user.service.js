const httpStatus = require('http-status');
const ApiError = require('../utills/ApiError');
const User = require('../models/user.model');

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

const addFriends=async(userData)=>{
    
}
module.exports = {
    getUserByEmail,
    getUserById
};