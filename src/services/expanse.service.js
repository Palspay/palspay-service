const httpStatus = require('http-status');
const ApiError = require('../utills/ApiError');
const User = require('../models/user.model');
const Expanse = require('../models/expanse.model');
const mongoose = require('mongoose');
const GroupMember=require('../models/group-members.model');
const { ObjectId } = mongoose.Types;

const createExpanse = async (expanseData) => {
    try {
        // expanseData['userId'] = expanseData.userId;
        const { description, amount, userId, groupId } = expanseData;
        const groupMembers = await GroupMember.find({ group_id: groupId, is_friendship: true }).exec();
        const numUsers = groupMembers.length;
        const [equalShare, remainingAmount] = calculateEqualDivision(amount, numUsers);
        const expenseDivisions = [];
        for (let i = 0; i < numUsers; i++) {
            const { member_id } = groupMembers[i];
            let amountOwed = equalShare;
            if (i === 0) {
                amountOwed += parseFloat(remainingAmount);
            }
            expenseDivisions.push({
                user: member_id,
                amountOwed: amountOwed.toFixed(2),
            });
        }
        const expense = new Expanse({
            description: description,
            amount: amount,
            userId: userId,
            groupId: groupId,
            divisions: expenseDivisions,
        });
        return await expense.save();
    } catch (error) {
        console.log(error);
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
    }
};

const calculateEqualDivision = (totalAmount, numUsers) => {
    const equalShare = Math.floor((totalAmount / numUsers) * 100) / 100;
    const remainingAmount = (totalAmount - (equalShare * numUsers)).toFixed(2);
    return [equalShare, remainingAmount];
};

const getGroupExpanse = async (userData) => {
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
                            divisions:"$divisions",
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