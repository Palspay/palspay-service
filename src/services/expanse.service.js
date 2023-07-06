const httpStatus = require('http-status');
const ApiError = require('../utills/ApiError');
const User = require('../models/user.model');
const { v4: uuidv4 } = require('uuid');
const config = require('../config/config');
const Expanse = require('../models/expanse.model');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

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
};

const getGroupExpanse = async(userData) => {
    try {
        let agg = [
            { $match: { groupId: new ObjectId(userData.groupId), }, },
            { "$lookup": { "from": "groups_members", "localField": "groupId", "foreignField": "group_id", "as": "groupsMembers" } },
            { "$lookup": { "from": "users", "localField": "groupsMembers.member_id", "foreignField": "_id", "as": "membersDetails" }, },
            { "$lookup": { "from": "users", "localField": "userId", "foreignField": "_id", "as": "usersDetail" }, },
            { $unwind: "$usersDetail" },
            {
                $group: {
                    _id: { groupId: "$groupId" },
                    data: {
                        $push: {
                            _id: "$_id",
                            amount: "$amount",
                            groupId: "$groupId",
                            usersName: "$usersDetail.name",
                            description: {
                                $cond: { if: "$description", then: "$description", else: "" }
                            },
                        }
                    },
                    groupsMembers: { $first: "$membersDetails.name" },
                    total: { $sum: "$amount" },
                },
            },
            {
                "$project": {
                    _id: 0,
                    data: 1,
                    groupsMembers: 1,
                    total: 1,
                    groupsMembersCount: { $size: "$groupsMembers" },
                }
            },
        ];
        const expanse = await Expanse.aggregate(agg);
        return expanse[0];
    } catch (error) {
        console.log(error, "<<error")
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
    }
};
module.exports = {
    createExpanse,
    getGroupExpanse
};