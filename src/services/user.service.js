const httpStatus = require('http-status');
const ApiError = require('../utills/ApiError');
const User = require('../models/user.model');
const { v4: uuidv4 } = require('uuid');
const config = require('../config/config');
const Groups = require('../models/group.model');
const GroupMember = require('../models/group-members.model');
const mongoose = require('mongoose');
const moment = require('moment-timezone');
const Plans = require('./../models/plan.model');
/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
    return User.findOne({ email, is_deleted: false, is_otp_verify: true });
};

const getUserById = async (userId) => {
    return User.findOne({ _id: userId, is_deleted: false });
}

const getUserByMobile = async (mobile) => {
    // return User.findOne({ mobile, is_deleted: false, is_otp_verify: true, });
    return User.findOne({ mobile, is_deleted: false });

}

const getFriendsById = async (userId) => {
    const friendsList = await User.aggregate([{
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

async function areFriends(userId) {
    const user1 = await User.findOne({ _id: userId }).populate('friends').exec();
    const user1Friends = user1.friends.map(friend => friend._id.toString());
    return user1Friends;
}

const addFriends = async (userData) => {
    try {
        const promises = [];
        const tokenData = [];
        const currentUserGroupMember = await GroupMember.findOne({ group_id: userData.group_id, member_id: userData.userId, is_friendship: true }).exec();
        for (const mobileNumber of userData.mobile) {
            const { name, mobile } = mobileNumber;
            const isExits = await getUserByMobile(mobile);
            if (isExits) {
                const isFriend = await areFriends(userData.userId);
                if (isFriend.length === 0 || !isFriend.includes(isExits._id.toString())) {
                    promises.push(User.findByIdAndUpdate(userData.userId, { $addToSet: { friends: isExits._id } }));
                    promises.push(User.findByIdAndUpdate(isExits._id, { $addToSet: { friends: userData.userId } }));
                    tokenData.push({
                        mobile: mobileNumber.mobile,
                        name: mobileNumber.name,
                        invite_link: ''
                    })
                }
                if (userData.group_id && userData.group_id !== '') {
                    const isAlreadyGroup = await GroupMember.findOne({ group_id: userData.group_id, member_id: isExits._id, is_friendship: true }).exec();
                    if (!isAlreadyGroup) {
                        promises.push(
                            GroupMember.create({
                                group_id: userData.group_id,
                                member_id: isExits._id,
                                created_by: userData.userId,
                                creation_date: userData.usecurrentDaterId,
                            })
                        );
                        tokenData.push({
                            mobile: isExits.mobile,
                            name: isExits.name,
                            invite_link: ''
                        })
                    }

                }
            } else {
                const inviteLink = config.invite_url + mobile.slice(0, 2) + uuidv4().substring(0, 8) + mobile.slice(2, 4);
                tokenData.push({
                    mobile: mobile,
                    name: name,
                    invite_link: inviteLink
                })
                const newUser = new User({
                    name,
                    mobile,
                    invite_token: inviteLink,
                    is_temp_registered: true
                });
                promises.push(newUser.save());
                if (userData.group_id && userData.group_id !== '') {
                    promises.push(
                        GroupMember.create({
                            group_id: userData.group_id,
                            member_id: newUser._id,
                            created_by: userData.userId,
                            creation_date: userData.usecurrentDaterId,
                        })
                    );
                }
                promises.push(User.findByIdAndUpdate(userData.userId, { $addToSet: { friends: newUser._id } }));
                promises.push(User.findByIdAndUpdate(newUser._id, { $addToSet: { friends: userData.userId } }));
            }

        }
        if (userData.group_id && currentUserGroupMember === null) {
            promises.push(
                GroupMember.create({
                    group_id: userData.group_id,
                    member_id: userData.userId,
                    created_by: userData.userId,
                    creation_date: userData.usecurrentDaterId,
                })
            );
        }
        await Promise.all(promises);
        return tokenData;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error; // Re-throw the ApiError
        } else {
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
        }
    }
}
const createGroups = async (groupData) => {
    try {
        groupData['created_by'] = groupData.userId;
        groupData['group_owner'] = groupData.userId;
        groupData['creation_date'] = groupData.usecurrentDaterId;
        const group = new Groups(groupData);
        return await group.save();
    } catch (error) {
        if (error instanceof ApiError) {
            throw error; // Re-throw the ApiError
        } else {
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
        }
    }

}

const getMembersByGroupId = async (userData) => {
    try {
        const members = await GroupMember.aggregate([{
            $match: { group_id: new mongoose.Types.ObjectId(userData.group_id), is_friendship: true }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'member_id',
                foreignField: '_id',
                as: 'memberDetails'
            }
        },
        {
            $unwind: '$memberDetails'
        },
        {
            $project: {
                _id: 0,
                member_id: 1,
                member_name: '$memberDetails.name',
                member_mobile: '$memberDetails.mobile'
            }
        }
        ]).exec();

        return members;
    } catch (error) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
    }
};

const getMyGroups = async (userId) => {
    try {
        const groupsList = await Groups.find({ group_owner: userId, is_deleted: false }).select({ group_name: 1, group_icon: 1, _id: 1 }).exec();
        return groupsList;
    } catch (error) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
    }
}
const setPasscode = async (userBody) => {
    try {
        const user = await getUserById(userBody.userId);
        if (!user) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Bad Request');
        }
        user.passcode = userBody.passcode;
        user.modification_date = userBody.currentDate;
        return await user.save();
    } catch (error) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
    }
}

const getAllTimezones = async () => {
    try {
        const timezones = moment.tz.names();
        return timezones;
    } catch (error) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
    }
}

const verifyUser = async (data) => {
    const isValid = await User.findOne({ mobile: data.mobile, is_deleted: false }, { _id: 1, name: 1 }).lean();
    if (isValid) {
        await User.findByIdAndUpdate(isValid._id, { $set: { otp: data.otp } }, { new: true, useFindAndModify: false }).lean();
    }
    return isValid
}

const createNewPassword = async (data) => {
    const isExists = await User.findOne({ _id: data.userId, is_deleted: false });
    if (isExists) {
        isExists.password = data.newPassword
        await isExists.save();
    }
    return isExists
}


const editProfile = async (data, id) => {
    const updateData = await User.findByIdAndUpdate({ _id: id }, { $set: data }, { new: true, useFindAndModify: false }).lean();
    return updateData
}


const leaveGroup = async (data, id) => {
    const updateData = await GroupMember.updateMany({ member_id: id, group_id: new mongoose.Types.ObjectId(data.group_id), is_friendship: true }, { $set: { is_friendship: false, is_deleted: true } }, { new: true }).lean();
    return updateData;
}

const deleteGroup = async (data, id) => {
    const updateData = await Groups.findOneAndUpdate({ group_owner: new mongoose.Types.ObjectId(id), _id: new mongoose.Types.ObjectId(data.group_id), is_deleted: false }, { $set: { is_deleted: true } }, { new: true }).lean();
    if (updateData) {
        await GroupMember.updateMany({ member_id: new mongoose.Types.ObjectId(id), group_id: new mongoose.Types.ObjectId(data.group_id) }, { $set: { is_friendship: false, is_deleted: true } }, { new: true }).lean();
    }
    return updateData;
}

const removeFriend = async (data, id) => {
    const updateData = await User.findOneAndUpdate({ _id: id }, {
        $pull: { friends: new mongoose.Types.ObjectId(data.user_id) }
    }, { new: true }).lean();
    return updateData;
}

const takePlan = async (data, id) => {
    const planValid = await Plans.findOne({ _id: data.plan_id, is_deleted: false }).exec();
    if(!planValid){
        throw new ApiError(httpStatus.BAD_REQUEST, 'Sorry, this plan not exits in our database');
    }
    const originalDate = new Date(data.modification_date);
    if (data.plan_type === 'Yearly') {
        originalDate.setFullYear(originalDate.getFullYear() + 1);
        data['plan_expired'] = originalDate.getTime();
    } else if (data.plan_type === 'Monthly') {
        originalDate.setMonth(originalDate.getMonth() + 1);
        if (originalDate.getDate() !== new Date(originalTimestamp).getDate()) {
            originalDate.setDate(0);
        }
        data['plan_expired'] = Date.parse(originalDate.getTime());
    }
    const updateData = await User.findByIdAndUpdate({ _id: id }, { $set: data }, { new: true }).lean();
    return updateData
}

module.exports = {
    getUserByEmail,
    getUserById,
    addFriends,
    getUserByMobile,
    getFriendsById,
    createGroups,
    getMembersByGroupId,
    getMyGroups,
    setPasscode,
    getAllTimezones,
    verifyUser,
    createNewPassword,
    editProfile,
    leaveGroup,
    deleteGroup,
    removeFriend,
    takePlan
};
