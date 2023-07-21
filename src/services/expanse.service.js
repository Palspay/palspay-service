const httpStatus = require('http-status');
const ApiError = require('../utills/ApiError');
const User = require('../models/user.model');
const Expanse = require('../models/expanse.model');
const mongoose = require('mongoose');
const GroupMember = require('../models/group-members.model');
const { ObjectId } = mongoose.Types;

const createExpanse = async(expanseData) => {
    try {
        expanseData['userId'] = expanseData.userId;
        var imagesArray = [];
        if (expanseData.imageArray.length > 0) {
            for await (let item of expanseData.imageArray) {
                imagesArray.push({
                    imgS3Key: 'expanseImages/' + item.imgName,
                    imgName: item.imgName,
                    isPrimary: false
                });
            }
        }
        expanseData['imagesArray'] = imagesArray;
        const expense = new Expanse(expanseData);
        return await expense.save();
    } catch (error) {
        console.log(error);
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
    }
};
const updateExpanse = async(expanseData) => {
    try {
        expanseData['userId'] = expanseData.userId;
        var imagesArray = [];
        if (expanseData.imageArray.length > 0) {
            for await (let item of expanseData.imageArray) {
                imagesArray.push({
                    imgS3Key: 'expanseImages/' + item.imgName,
                    imgName: item.imgName,
                    isPrimary: false
                });
            }
        }
        expanseData['imagesArray'] = imagesArray;
        var check = await Expanse.deleteOne({ _id: new ObjectId(expanseData.expanseId) });
        const expense = new Expanse(expanseData);
        return await expense.save();
    } catch (error) {
        console.log(error);
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
    }
};

const deleteExpanse = async(expanseData) => {
    try {
        await Expanse.findByIdAndUpdate({ _id: new ObjectId(expanseData.expanseId) }, { $set: { is_deleted: true } }, { new: true, useFindAndModify: false }).lean();
        return true;
    } catch (error) {
        console.log(error);
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
    }
};

const getGroupExpanse = async(userData) => {
    try {
        let { groupId } = userData
        let agg = [
            { $match: { groupId }, },
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
                            totalExpanse: "$totalExpanse",
                            groupId: "$groupId",
                            usersName: "$usersDetail.name",
                            description: {
                                $cond: { if: "$description", then: "$description", else: "" }
                            },
                            divisions: "$divisions",
                        }
                    },
                    groupsMembers: { $first: "$membersDetails.name" },
                    total: { $sum: "$totalExpanse" },
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
const fetchExpanse = async(userData) => {
    try {
        let agg = [
            { $match: { _id: new ObjectId(userData.expanseId), is_deleted: false } },
            {
                $lookup: {
                    from: "users",
                    localField: "splitEqually.memberId",
                    foreignField: "_id",
                    as: "splitEquallyUsers"
                }
            },
            {
                "$project": {
                    groupId: 1,
                    totalExpanse: 1,
                    description: 1,
                    addPayer: 1,
                    imagesArray: 1,
                    splitEqually: 1,
                    splitUnequally: 1,
                    splitByPercentage: 1,
                    splitByShare: 1,
                    splitByAdjustments: 1,
                    is_deleted: 1,
                    createdAt: 1
                }
            }
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
    updateExpanse,
    getGroupExpanse,
    fetchExpanse,
    deleteExpanse
};