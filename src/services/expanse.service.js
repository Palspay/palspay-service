const httpStatus = require('http-status');
const ApiError = require('../utills/ApiError');
const User = require('../models/user.model');
const Expanse = require('../models/expanse.model');
const mongoose = require('mongoose');
const GroupMember = require('../models/group-members.model');
const { ObjectId } = mongoose.Types;
const activityService = require('./activity.service');

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
        const obj = {
            description: 'you create' + expanseData.description + ' expanse sucessfully',
            user_id: expanseData.userId
        }
        await activityService.createActivity(obj);
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
        expanseData['_id'] = expanseData.expanseId;
        expanseData['imagesArray'] = imagesArray;
        await Expanse.deleteOne({ _id: new ObjectId(expanseData.expanseId) });
        const expense = new Expanse(expanseData);
        return await expense.save();
    } catch (error) {
        console.log(error);
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
    }
};

const deleteExpanse = async(expanseData) => {
    try {
        const expanse=await Expanse.findByIdAndUpdate({ _id: new ObjectId(expanseData.expanseId) }, { $set: { is_deleted: true } }, { new: true, useFindAndModify: false }).lean();
        const obj = {
            description: 'you delete' + expanse.description + ' expanse sucessfully',
            user_id: expanseData.userId
        }
        await activityService.createActivity(obj);
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
            {
                $addFields: {
                    groupIdObjectId: {
                        $cond: {
                            if: { $ne: ["$groupId", ""] },
                            then: { $toObjectId: "$groupId" },
                            else: "$groupId"
                        }
                    }
                }
            },
            { "$lookup": { "from": "groups_members", "localField": "groupIdObjectId", "foreignField": "group_id", "as": "groupsMembers" } },
            { "$lookup": { "from": "users", "localField": "groupsMembers.member_id", "foreignField": "_id", "as": "membersDetails" }, },
            { "$lookup": { "from": "users", "localField": "userId", "foreignField": "_id", "as": "usersDetail" }, },
            { $unwind: "$usersDetail" },
            {
                $group: {
                    _id: { groupId: "$groupId" },
                    expanseList: {
                        $push: {
                            _id: "$_id",
                            totalExpanse: "$totalExpanse",
                            groupId: "$groupId",
                            usersName: "$usersDetail.name",
                            description: {
                                $cond: { if: "$description", then: "$description", else: "" }
                            },
                            addPayer: "$addPayer"
                        }
                    },
                    groupsMembers: { $first: "$membersDetails._id" },
                    total: { $sum: "$totalExpanse" },
                },
            },
            {
                "$project": {
                    _id: 0,
                    expanseList: 1,
                    groupsMembers: 1,
                    total: 1,
                    groupsMembersCount: { $size: "$groupsMembers" },
                }
            },
        ];
        const expanse = await Expanse.aggregate(agg);

        let dataArr = [];

        const expanseList = expanse[0].expanseList;
        const groupsMembers = expanse[0].groupsMembers;
        const totalExpanse = expanse[0].total;
        const groupsMembersCount = expanse[0].groupsMembersCount;
        const equalShare = totalExpanse / groupsMembersCount;

        const memberAmounts = {};

        groupsMembers.forEach(memberId => {
            memberAmounts[memberId] = 0;
        });
        expanseList.forEach(expense => {
            expense.addPayer.forEach(async payer => {
                const payerId = payer.from;
                const amount = payer.amount;

                // Add the amount to the corresponding member in memberAmounts
                memberAmounts[payerId] += amount;
                const data = await User.findOne(payer.from, { name: 1 }).lean();
                payer.name = data ? data.name : "--";
            });
        });
        const resultArray = [];

        for (const memberId in memberAmounts) {
            var owesYou = 0;
            var youOwe = 0;
            const amountPaid = memberAmounts[memberId];
            const balances = parseFloat(equalShare).toFixed(2) - parseFloat(amountPaid).toFixed(2);
            const balance = balances.toFixed(2);
            if (balance > 0) {
                owesYou = balance;
            } else if (balance < 0) {
                youOwe = balance;
            }
            resultArray.push({ memberId, amountPaid, equalShare: Number(equalShare.toFixed(2)), owesYou: Number(owesYou), youOwe: Number(youOwe) });
        }
        // expanse[0].youOwe = resultArray
        return expanse[0];
    } catch (error) {
        throw new ApiError(httpStatus.NOT_FOUND, 'no data found');
    }
};
const fetchExpanse = async(data) => {
    try {
        let agg = [
            { $match: { _id: new ObjectId(data.expanseId), is_deleted: false } },
            { "$lookup": { "from": "users", "localField": "userId", "foreignField": "_id", "as": "usersData" }, },
            { $unwind: "$usersData" },
            {
                $addFields: {
                    groupIdObjectId: {
                        $cond: {
                            if: { $ne: ["$groupId", ""] }, // Check if groupId is not blank
                            then: { $toObjectId: "$groupId" }, // Convert groupId to ObjectId
                            else: "$groupId" // Keep groupId as is
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "splitEqually.memberId",
                    foreignField: "_id",
                    as: "splitEquallyUsers"
                }
            },
            {
                $lookup: {
                    from: "groups",
                    localField: "groupIdObjectId",
                    foreignField: "_id",
                    as: "groupInfo"
                }
            },
            { $unwind: { path: "$groupInfo", preserveNullAndEmptyArrays: true } },
            {
                "$project": {
                    groupId: 1,
                    expanseAddedBy: "$usersData.name",
                    groupName: {
                        $cond: {
                            if: { $ne: ["$groupId", ""] },
                            then: "$groupInfo.group_name",
                            else: ""
                        }
                    },
                    userId: 1,
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
                    members: 1,
                    currency: 1,
                    createdAt: 1
                }
            }
        ];
        const expanse = await Expanse.aggregate(agg);
        let lentAmount = 0,
            borrowedAmount = 0;
        for await (let item of expanse) {
            item.you_lent = 0;
            item.you_borrowed = 0;
            let non_group = [];

            // splitEqually
            if (item.splitEqually.length > 0) {
                for await (let per of item.splitEqually) {
                    if (per.memberId.toString() == data.userId.toString()) {
                        non_group.push({ type: "owe", memberId: per.memberId, amount: per.amount })
                        if (item.addPayer.every(payer => data.userId.toString() !== payer.from.toString())) {
                            borrowedAmount = parseFloat(per.amount);
                        }
                    } else {
                        non_group.push({ type: "owes", memberId: per.memberId, amount: per.amount })
                        lentAmount += parseFloat(per.amount);
                    }
                }
            }
            // splitUnequally
            if (item.splitUnequally.length > 0) {
                for await (let per of item.splitUnequally) {
                    if (per.memberId.toString() == data.userId.toString()) {
                        non_group.push({ type: "owe", memberId: per.memberId, amount: per.amount })
                        if (item.addPayer.every(payer => data.userId.toString() !== payer.from.toString())) {
                            borrowedAmount = parseFloat(per.amount);
                        }
                    } else {
                        non_group.push({ type: "owes", memberId: per.memberId, amount: per.amount })
                        lentAmount += parseFloat(per.amount);
                    }
                }
            }
            // splitByPercentage
            if (item.splitByPercentage.length > 0) {
                for await (let per of item.splitByPercentage) {
                    if (per.memberId.toString() == data.userId.toString()) {
                        non_group.push({ type: "owe", memberId: per.memberId, amount: per.amount })
                        if (item.addPayer.every(payer => data.userId.toString() !== payer.from.toString())) {
                            borrowedAmount = parseFloat(per.amount);
                        }
                    } else {
                        non_group.push({ type: "owes", memberId: per.memberId, amount: per.amount })
                        lentAmount += parseFloat(per.amount);
                    }
                }
            }
            // splitByShare
            if (item.splitByShare.length > 0) {
                for await (let per of item.splitByShare) {
                    if (per.memberId.toString() == data.userId.toString()) {
                        non_group.push({ type: "owe", memberId: per.memberId, amount: per.amount })
                        if (item.addPayer.every(payer => data.userId.toString() !== payer.from.toString())) {
                            borrowedAmount = parseFloat(per.amount);
                        }
                    } else {
                        non_group.push({ type: "owes", memberId: per.memberId, amount: per.amount })
                        lentAmount += parseFloat(per.amount);
                    }
                }
            }

            // splitByAdjustments
            if (item.splitByAdjustments.length > 0) {
                for await (let per of item.splitByAdjustments) {
                    if (per.memberId.toString() == data.userId.toString()) {
                        non_group.push({ type: "owe", memberId: per.memberId, amount: per.amount })
                        if (item.addPayer.every(payer => data.userId.toString() !== payer.from.toString())) {
                            borrowedAmount = parseFloat(per.amount);
                        }
                    } else {
                        non_group.push({ type: "owes", memberId: per.memberId, amount: per.amount })
                        lentAmount += parseFloat(per.amount);
                    }
                }
            }
            item.expanse_details = non_group;
            if (item.addPayer.every(payer => data.userId.toString() !== payer.from.toString())) {
                item.you_borrowed = borrowedAmount.toFixed(2);
            } else {
                item.you_lent = lentAmount.toFixed(2);
            }
        }
        for await (let item of expanse[0].expanse_details) {
            const data = await User.findOne(item.memberId, { name: 1 }).lean();
            item.name = data ? data.name : "--";
        }
        for await (let item of expanse[0].addPayer) {
            const data = await User.findOne(item.from, { name: 1 }).lean();
            item.name = data ? data.name : "--";
        }
        return expanse[0];
    } catch (error) {
        console.log(error, "<<error")
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
    }
};
const individualExpanse = async(data) => {
    try {
        let agg = [{
                $match: {
                    groupId: { $eq: "" },
                    is_deleted: false,
                    // userId: data.userId,
                    $or: [
                        // { "addPayer.from": data.userId },
                        { "members.memberId": data.userId },
                    ]
                }
            },
            { "$lookup": { "from": "users", "localField": "userId", "foreignField": "_id", "as": "usersData" }, },
            { $unwind: "$usersData" },
            {
                $addFields: {
                    groupIdObjectId: {
                        $cond: {
                            if: { $ne: ["$groupId", ""] }, // Check if groupId is not blank
                            then: { $toObjectId: "$groupId" }, // Convert groupId to ObjectId
                            else: "$groupId" // Keep groupId as is
                        }
                    },
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "splitEqually.memberId",
                    foreignField: "_id",
                    as: "splitEquallyUsers"
                }
            },
            {
                $lookup: {
                    from: "groups",
                    localField: "groupIdObjectId",
                    foreignField: "_id",
                    as: "groupInfo"
                }
            },
            { $unwind: { path: "$groupInfo", preserveNullAndEmptyArrays: true } },
            {
                "$project": {
                    groupId: 1,
                    expanseAddedBy: "$usersData.name",
                    groupName: {
                        $cond: {
                            if: { $ne: ["$groupId", ""] },
                            then: "$groupInfo.group_name",
                            else: ""
                        }
                    },
                    userId: 1,
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
                    members: 1,
                    currency: 1,
                    createdAt: 1
                }
            }
        ];
        const expanse = await Expanse.aggregate(agg);
        for await (let item of expanse) {
            let non_group = [];

            // splitEqually
            if (item.splitEqually.length > 0) {
                for await (let per of item.splitEqually) {
                    if (per.memberId.toString() == data.userId.toString()) {
                        non_group.push({ type: "owe", memberId: per.memberId, amount: per.amount })
                    } else {
                        non_group.push({ type: "owes", memberId: per.memberId, amount: per.amount })
                    }
                }
            }
            // splitUnequally
            if (item.splitUnequally.length > 0) {
                for await (let per of item.splitUnequally) {
                    if (per.memberId.toString() == data.userId.toString()) {
                        non_group.push({ type: "owe", memberId: per.memberId, amount: per.amount })
                    } else {
                        non_group.push({ type: "owes", memberId: per.memberId, amount: per.amount })
                    }
                }
            }
            // splitByPercentage
            if (item.splitByPercentage.length > 0) {
                for await (let per of item.splitByPercentage) {
                    if (per.memberId.toString() == data.userId.toString()) {
                        non_group.push({ type: "owe", memberId: per.memberId, amount: per.amount })
                    } else {
                        non_group.push({ type: "owes", memberId: per.memberId, amount: per.amount })
                    }
                }
            }
            // splitByShare
            if (item.splitByShare.length > 0) {
                for await (let per of item.splitByShare) {
                    if (per.memberId.toString() == data.userId.toString()) {
                        non_group.push({ type: "owe", memberId: per.memberId, amount: per.amount })
                    } else {
                        non_group.push({ type: "owes", memberId: per.memberId, amount: per.amount })
                    }
                }
            }

            // splitByAdjustments
            if (item.splitByAdjustments.length > 0) {
                for await (let per of item.splitByAdjustments) {
                    if (per.memberId.toString() == data.userId.toString()) {
                        non_group.push({ type: "owe", memberId: per.memberId, amount: per.amount })
                    } else {
                        non_group.push({ type: "owes", memberId: per.memberId, amount: per.amount })
                    }
                }
            }
            item.non_group_expanse = non_group;
        }
        return expanse;
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
    deleteExpanse,
    individualExpanse
};