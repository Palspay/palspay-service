const httpStatus = require('http-status');
const ApiError = require('../utills/ApiError');
const User = require('../models/user.model');

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
    console.log(email);
    return User.findOne({ email, is_deleted: false });
};

module.exports = {
    getUserByEmail
};