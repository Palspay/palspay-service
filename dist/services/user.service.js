"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var group_wallet_modal_1 = __importDefault(require("../models/group-wallet.modal"));
var httpStatus = require('http-status');
var ApiError = require('../utills/ApiError');
var User = require('../models/user.model');
var uuidv4 = require('uuid').v4;
var config = require('../config/config');
var Groups = require('../models/group.model');
var GroupMember = require('../models/group-members.model');
var mongoose = require('mongoose');
var moment = require('moment-timezone');
var Plans = require('./../models/plan.model');
var Activity = require('../models/activity.model');
var _a = require('../models/transaction.model'), Transaction = _a.Transaction, PaymentStatus = _a.PaymentStatus;
var activityService = require('./activity.service');
var GroupMembersList = require('../models/GroupMembersList.model');
/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
var getUserByEmail = function (email_1) {
    var args_1 = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args_1[_i - 1] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([email_1], args_1, true), void 0, function (email, verifyOtp) {
        if (verifyOtp === void 0) { verifyOtp = true; }
        return __generator(this, function (_a) {
            return [2 /*return*/, User.findOne({ email: email, is_deleted: false, is_otp_verify: verifyOtp })];
        });
    });
};
var getUserById = function (userId) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, User.findOne({ _id: userId, is_deleted: false })];
    });
}); };
var getUserByMobile = function (mobile) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        // return User.findOne({ mobile, is_deleted: false, is_otp_verify: true, });
        return [2 /*return*/, User.findOne({ mobile: mobile, is_deleted: false })];
    });
}); };
var getFriendsById = function (userId) { return __awaiter(void 0, void 0, void 0, function () {
    var friendsList;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, User.aggregate([{
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
                ])];
            case 1:
                friendsList = _a.sent();
                if (friendsList.length === 0) {
                    throw new ApiError(httpStatus.NOT_FOUND, 'Data Not Found');
                }
                return [2 /*return*/, friendsList];
        }
    });
}); };
function areFriends(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var user1, user1Friends;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, User.findOne({ _id: userId }).populate('friends').exec()];
                case 1:
                    user1 = _a.sent();
                    user1Friends = user1.friends.map(function (friend) { return friend._id.toString(); });
                    return [2 /*return*/, user1Friends];
            }
        });
    });
}
function areFriends(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var user1, user1Friends;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, User.findOne({ _id: userId }).populate('friends').exec()];
                case 1:
                    user1 = _a.sent();
                    user1Friends = user1.friends.map(function (friend) { return friend._id.toString(); });
                    return [2 /*return*/, user1Friends];
            }
        });
    });
}
var getUserDetails = function (userId) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, User.findOne({ _id: userId }).select('name email vpa mobile')];
            case 1:
                user = _a.sent();
                if (!user) {
                    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
                }
                return [2 /*return*/, user];
        }
    });
}); };
var addFriends = function (userData) { return __awaiter(void 0, void 0, void 0, function () {
    var promises, tokenData, activityArray, currentUserGroupMember, group, _i, _a, mobileNumber, name_1, mobile, isExits, isFriend, isAlreadyGroup, inviteLink, newUser, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 13, , 14]);
                promises = [];
                tokenData = [];
                activityArray = [];
                return [4 /*yield*/, GroupMember.findOne({ group_id: userData.group_id, member_id: userData.userId, is_friendship: true }).exec()];
            case 1:
                currentUserGroupMember = _b.sent();
                return [4 /*yield*/, Groups.findOne({ _id: new mongoose.Types.ObjectId(userData.group_id) }).exec()];
            case 2:
                group = _b.sent();
                _i = 0, _a = userData.mobile;
                _b.label = 3;
            case 3:
                if (!(_i < _a.length)) return [3 /*break*/, 10];
                mobileNumber = _a[_i];
                name_1 = mobileNumber.name, mobile = mobileNumber.mobile;
                return [4 /*yield*/, getUserByMobile(mobile)];
            case 4:
                isExits = _b.sent();
                if (!isExits) return [3 /*break*/, 8];
                return [4 /*yield*/, areFriends(userData.userId)];
            case 5:
                isFriend = _b.sent();
                if (isFriend.length === 0 || !isFriend.includes(isExits._id.toString())) {
                    promises.push(User.findByIdAndUpdate(userData.userId, { $addToSet: { friends: isExits._id } }));
                    promises.push(User.findByIdAndUpdate(isExits._id, { $addToSet: { friends: userData.userId } }));
                    activityArray.push(Activity.create({
                        description: 'you added ' + isExits.name + ' to the palspay app',
                        user_id: userData.userId
                    }));
                    tokenData.push({
                        mobile: mobileNumber.mobile,
                        name: mobileNumber.name,
                        invite_link: ''
                    });
                }
                if (!(userData.group_id && userData.group_id !== '')) return [3 /*break*/, 7];
                return [4 /*yield*/, GroupMember.findOne({ group_id: userData.group_id, member_id: isExits._id, is_friendship: true }).exec()];
            case 6:
                isAlreadyGroup = _b.sent();
                if (!isAlreadyGroup) {
                    promises.push(GroupMember.create({
                        group_id: userData.group_id,
                        member_id: isExits._id,
                        created_by: userData.userId,
                        creation_date: userData.usecurrentDaterId,
                    }));
                    tokenData.push({
                        mobile: isExits.mobile,
                        name: isExits.name,
                        invite_link: ''
                    });
                    activityArray.push(Activity.create({
                        description: 'you added ' + isExits.name + ' to the ' + group.group_name,
                        user_id: userData.userId
                    }));
                }
                _b.label = 7;
            case 7: return [3 /*break*/, 9];
            case 8:
                inviteLink = config.invite_url + mobile.slice(0, 2) + uuidv4().substring(0, 8) + mobile.slice(2, 4);
                tokenData.push({
                    mobile: mobile,
                    name: name_1,
                    invite_link: inviteLink
                });
                newUser = new User({
                    name: name_1,
                    mobile: mobile,
                    invite_token: inviteLink,
                    is_temp_registered: true
                });
                promises.push(newUser.save());
                if (userData.group_id && userData.group_id !== '') {
                    promises.push(GroupMember.create({
                        group_id: userData.group_id,
                        member_id: newUser._id,
                        created_by: userData.userId,
                        creation_date: userData.usecurrentDaterId,
                    }));
                    activityArray.push(Activity.create({
                        description: 'you addedd ' + name_1 + ' to the ' + group.group_name,
                        user_id: userData.userId
                    }));
                }
                promises.push(User.findByIdAndUpdate(userData.userId, { $addToSet: { friends: newUser._id } }));
                promises.push(User.findByIdAndUpdate(newUser._id, { $addToSet: { friends: userData.userId } }));
                _b.label = 9;
            case 9:
                _i++;
                return [3 /*break*/, 3];
            case 10:
                if (userData.group_id && currentUserGroupMember === null) {
                    promises.push(GroupMember.create({
                        group_id: userData.group_id,
                        member_id: userData.userId,
                        created_by: userData.userId,
                        creation_date: userData.usecurrentDaterId,
                    }));
                }
                return [4 /*yield*/, Promise.all(promises)];
            case 11:
                _b.sent();
                return [4 /*yield*/, Promise.all(activityArray)];
            case 12:
                _b.sent();
                return [2 /*return*/, tokenData];
            case 13:
                error_1 = _b.sent();
                console.log(error_1);
                if (error_1 instanceof ApiError) {
                    throw error_1; // Re-throw the ApiError
                }
                else {
                    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
                }
                return [3 /*break*/, 14];
            case 14: return [2 /*return*/];
        }
    });
}); };
var createGroups = function (groupData) { return __awaiter(void 0, void 0, void 0, function () {
    var group, obj, createdGroup, groupWallet, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                // create group
                groupData['created_by'] = groupData.userId;
                groupData['group_owner'] = groupData.userId;
                groupData['creation_date'] = groupData.usecurrentDaterId;
                group = new Groups(groupData);
                obj = {
                    description: 'You created a new group ' + groupData.group_name,
                    user_id: groupData.userId
                };
                // Create activity
                return [4 /*yield*/, activityService.createActivity(obj)];
            case 1:
                // Create activity
                _a.sent();
                return [4 /*yield*/, group.save()];
            case 2:
                createdGroup = _a.sent();
                return [4 /*yield*/, group_wallet_modal_1.default.create({
                        group_id: group._id,
                        balance: 0,
                        transactions: []
                    })];
            case 3:
                groupWallet = _a.sent();
                createdGroup['group_wallet'] = groupWallet._id;
                // create group members
                return [4 /*yield*/, GroupMember.create({
                        group_id: createdGroup._id,
                        member_id: groupData.userId,
                        created_by: groupData.userId,
                        creation_date: groupData.usecurrentDaterId,
                    })];
            case 4:
                // create group members
                _a.sent();
                return [2 /*return*/, createdGroup];
            case 5:
                error_2 = _a.sent();
                if (error_2 instanceof ApiError) {
                    throw error_2; // Re-throw the ApiError
                }
                else {
                    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
                }
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
var getMembersByGroupId = function (userData) { return __awaiter(void 0, void 0, void 0, function () {
    var members, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, GroupMember.aggregate([{
                            $match: { group_id: new mongoose.Types.ObjectId(userData.groupId), is_friendship: true }
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
                    ]).exec()];
            case 1:
                members = _a.sent();
                return [2 /*return*/, members];
            case 2:
                error_3 = _a.sent();
                throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
            case 3: return [2 /*return*/];
        }
    });
}); };
var getGroupDetails = function (groupId) { return __awaiter(void 0, void 0, void 0, function () {
    var groupDetails, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Groups.findById(groupId).exec()];
            case 1:
                groupDetails = _a.sent();
                return [2 /*return*/, groupDetails];
            case 2:
                error_4 = _a.sent();
                throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
            case 3: return [2 /*return*/];
        }
    });
}); };
var updateGroupPreference = function (groupData) { return __awaiter(void 0, void 0, void 0, function () {
    var updateFields, updatedGroup, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                updateFields = {
                    modification_date: groupData.currentDate,
                    modified_by: groupData.userId
                };
                // Conditionally add fields to the update object
                if (groupData.group_name !== undefined) {
                    updateFields.group_name = groupData.group_name;
                }
                if (groupData.group_icon !== undefined) {
                    updateFields.group_icon = groupData.group_icon;
                }
                if (groupData.owner_only_payment !== undefined) {
                    updateFields.owner_only_payment = groupData.owner_only_payment;
                }
                return [4 /*yield*/, Groups.findByIdAndUpdate({ _id: groupData.groupId }, { $set: updateFields }, { new: true })];
            case 1:
                updatedGroup = _a.sent();
                if (!updatedGroup) {
                    throw new Error('Group not found or unable to update');
                }
                return [2 /*return*/, updatedGroup];
            case 2:
                error_5 = _a.sent();
                throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Error updating group: ".concat(error_5.message));
            case 3: return [2 /*return*/];
        }
    });
}); };
var getMyGroups = function (userId) { return __awaiter(void 0, void 0, void 0, function () {
    var groupsList, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Groups.aggregate([
                        {
                            $lookup: {
                                from: 'groups_members',
                                localField: '_id',
                                foreignField: 'group_id',
                                as: 'members'
                            }
                        },
                        {
                            $unwind: {
                                path: '$members',
                            }
                        },
                        {
                            $match: {
                                'members.member_id': new mongoose.Types.ObjectId(userId),
                                'members.is_deleted': false,
                                'is_deleted': false,
                                'members.is_friendship': true
                            }
                        },
                        {
                            $project: {
                                _id: 1,
                                group_name: 1,
                                group_icon: 1
                            }
                        }
                    ])];
            case 1:
                groupsList = _a.sent();
                // const groupsList = await Groups.find({ group_owner: userId, is_deleted: false }).select({ group_name: 1, group_icon: 1, _id: 1 }).exec();
                return [2 /*return*/, groupsList];
            case 2:
                error_6 = _a.sent();
                throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
            case 3: return [2 /*return*/];
        }
    });
}); };
var setPasscode = function (userBody) { return __awaiter(void 0, void 0, void 0, function () {
    var user, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, getUserById(userBody.userId)];
            case 1:
                user = _a.sent();
                if (!user) {
                    throw new ApiError(httpStatus.BAD_REQUEST, 'Bad Request');
                }
                user.passcode = userBody.passcode;
                user.modification_date = userBody.currentDate;
                return [4 /*yield*/, user.save()];
            case 2: return [2 /*return*/, _a.sent()];
            case 3:
                error_7 = _a.sent();
                throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
            case 4: return [2 /*return*/];
        }
    });
}); };
var getAllTimezones = function () { return __awaiter(void 0, void 0, void 0, function () {
    var timezones;
    return __generator(this, function (_a) {
        try {
            timezones = moment.tz.names();
            return [2 /*return*/, timezones];
        }
        catch (error) {
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
        }
        return [2 /*return*/];
    });
}); };
var verifyUser = function (data) { return __awaiter(void 0, void 0, void 0, function () {
    var isValid;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, User.findOne({ mobile: data.mobile, is_deleted: false }, { _id: 1, name: 1 }).lean()];
            case 1:
                isValid = _a.sent();
                if (!isValid) return [3 /*break*/, 3];
                return [4 /*yield*/, User.findByIdAndUpdate(isValid._id, { $set: { otp: data.otp } }, { new: true, useFindAndModify: false }).lean()];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3: return [2 /*return*/, isValid];
        }
    });
}); };
var createNewPassword = function (data) { return __awaiter(void 0, void 0, void 0, function () {
    var isExists;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, User.findOne({ _id: data.userId, is_deleted: false })];
            case 1:
                isExists = _a.sent();
                if (!isExists) return [3 /*break*/, 3];
                isExists.password = data.newPassword;
                return [4 /*yield*/, isExists.save()];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3: return [2 /*return*/, isExists];
        }
    });
}); };
var editProfile = function (data, id) { return __awaiter(void 0, void 0, void 0, function () {
    var updateData;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, User.findByIdAndUpdate({ _id: id }, { $set: data }, { new: true, useFindAndModify: false }).lean()];
            case 1:
                updateData = _a.sent();
                return [2 /*return*/, updateData];
        }
    });
}); };
var leaveGroup = function (data, id) { return __awaiter(void 0, void 0, void 0, function () {
    var updateData, group, obj;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, GroupMember.updateMany({ member_id: id, group_id: new mongoose.Types.ObjectId(data.group_id), is_friendship: true }, { $set: { is_friendship: false } }, { new: true }).lean()];
            case 1:
                updateData = _a.sent();
                return [4 /*yield*/, Groups.findOne({ _id: new mongoose.Types.ObjectId(data.group_id) }).exec()];
            case 2:
                group = _a.sent();
                obj = {
                    description: 'you leave ' + group.group_name + ' sucessfully',
                    user_id: id
                };
                return [4 /*yield*/, activityService.createActivity(obj)];
            case 3:
                _a.sent();
                return [2 /*return*/, updateData];
        }
    });
}); };
var deleteGroup = function (data, id) { return __awaiter(void 0, void 0, void 0, function () {
    var updateData, obj;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Groups.findOneAndUpdate({ group_owner: new mongoose.Types.ObjectId(id), _id: new mongoose.Types.ObjectId(data.group_id), is_deleted: false }, { $set: { is_deleted: true } }, { new: true }).lean()];
            case 1:
                updateData = _a.sent();
                obj = {
                    description: 'you delete ' + (updateData === null || updateData === void 0 ? void 0 : updateData.group_name) + ' sucessfully',
                    user_id: id
                };
                return [4 /*yield*/, activityService.createActivity(obj)];
            case 2:
                _a.sent();
                if (!updateData) return [3 /*break*/, 4];
                return [4 /*yield*/, GroupMember.updateMany({ member_id: new mongoose.Types.ObjectId(id), group_id: new mongoose.Types.ObjectId(data.group_id) }, { $set: { is_friendship: false, is_deleted: true } }, { new: true }).lean()];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4: return [2 /*return*/, updateData];
        }
    });
}); };
var removeFriend = function (data, id) { return __awaiter(void 0, void 0, void 0, function () {
    var updateData, user, obj;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, User.findOneAndUpdate({ _id: id }, {
                    $pull: { friends: new mongoose.Types.ObjectId(data.user_id) }
                }, { new: true }).lean()];
            case 1:
                updateData = _a.sent();
                return [4 /*yield*/, getUserById(data.user_id)];
            case 2:
                user = _a.sent();
                obj = {
                    description: 'you remove  ' + user.name + ' for friends list sucessfully',
                    user_id: id
                };
                return [4 /*yield*/, activityService.createActivity(obj)];
            case 3:
                _a.sent();
                return [2 /*return*/, updateData];
        }
    });
}); };
var takePlan = function (data, id) { return __awaiter(void 0, void 0, void 0, function () {
    var planValid, originalDate, updateData;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Plans.findOne({ _id: data.plan_id, is_deleted: false }).exec()];
            case 1:
                planValid = _a.sent();
                if (!planValid) {
                    throw new ApiError(httpStatus.BAD_REQUEST, 'Sorry, this plan not exits in our database');
                }
                originalDate = new Date(data.modification_date);
                if (data.plan_type === 'Yearly') {
                    originalDate.setFullYear(originalDate.getFullYear() + 1);
                    data['plan_expired'] = originalDate.getTime();
                }
                else if (data.plan_type === 'Monthly') {
                    originalDate.setMonth(originalDate.getMonth() + 1);
                    // @ts-ignore
                    if (originalDate.getDate() !== new Date(originalTimestamp).getDate()) {
                        originalDate.setDate(0);
                    }
                    // @ts-ignore
                    data['plan_expired'] = Date.parse(originalDate.getTime());
                }
                return [4 /*yield*/, User.findByIdAndUpdate({ _id: id }, { $set: data }, { new: true }).lean()];
            case 2:
                updateData = _a.sent();
                return [2 /*return*/, updateData];
        }
    });
}); };
var getTransactions = function (userId) { return __awaiter(void 0, void 0, void 0, function () {
    var transactions, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Transaction.aggregate([
                        {
                            $match: {
                                userId: userId,
                                is_deleted: false,
                                status: PaymentStatus.PAYMENT_COMPLETED
                            }
                        },
                        {
                            $lookup: {
                                from: 'users',
                                localField: 'paidTo',
                                foreignField: '_id',
                                as: 'paidToUser'
                            }
                        },
                        {
                            $unwind: '$paidToUser'
                        },
                        {
                            $project: {
                                _id: 1,
                                amount: 1,
                                paidTo: {
                                    _id: '$paidToUser._id', // Include the paidTo ID
                                    name: '$paidToUser.name' // Include the name of the user
                                }
                            }
                        }
                    ])];
            case 1:
                transactions = _a.sent();
                return [2 /*return*/, transactions];
            case 2:
                error_8 = _a.sent();
                throw new Error('Error retrieving transactions: ' + error_8.message);
            case 3: return [2 /*return*/];
        }
    });
}); };
var findCommonGroups = function (currentUserId, otherUserId) { return __awaiter(void 0, void 0, void 0, function () {
    var currentUserGroups, otherUserGroups, currentUserGroupIds, otherUserGroupIds_1, commonGroupIds, commonGroups, error_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                return [4 /*yield*/, GroupMember.find({ member_id: currentUserId }).select('group_id').exec()];
            case 1:
                currentUserGroups = _a.sent();
                return [4 /*yield*/, GroupMember.find({ member_id: otherUserId }).select('group_id').exec()];
            case 2:
                otherUserGroups = _a.sent();
                currentUserGroupIds = currentUserGroups.map(function (group) { return group.group_id.toString(); });
                otherUserGroupIds_1 = otherUserGroups.map(function (group) { return group.group_id.toString(); });
                commonGroupIds = currentUserGroupIds.filter(function (groupId) { return otherUserGroupIds_1.includes(groupId); });
                return [4 /*yield*/, Groups.find({ _id: { $in: commonGroupIds } }).exec()];
            case 3:
                commonGroups = _a.sent();
                return [2 /*return*/, commonGroups];
            case 4:
                error_9 = _a.sent();
                console.log(error_9);
                throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
            case 5: return [2 /*return*/];
        }
    });
}); };
var getGroupWalletByGroupId = function (groupId) { return __awaiter(void 0, void 0, void 0, function () {
    var groupWallet, error_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, group_wallet_modal_1.default.findOne({ group_id: groupId }).exec()];
            case 1:
                groupWallet = _a.sent();
                if (!groupWallet) {
                    throw new ApiError(httpStatus.NOT_FOUND, 'Group wallet not found');
                }
                return [2 /*return*/, groupWallet];
            case 2:
                error_10 = _a.sent();
                throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
            case 3: return [2 /*return*/];
        }
    });
}); };
module.exports = {
    getUserByEmail: getUserByEmail,
    getUserById: getUserById,
    addFriends: addFriends,
    getUserByMobile: getUserByMobile,
    getFriendsById: getFriendsById,
    createGroups: createGroups,
    getMembersByGroupId: getMembersByGroupId,
    getMyGroups: getMyGroups,
    setPasscode: setPasscode,
    getAllTimezones: getAllTimezones,
    verifyUser: verifyUser,
    createNewPassword: createNewPassword,
    editProfile: editProfile,
    leaveGroup: leaveGroup,
    deleteGroup: deleteGroup,
    removeFriend: removeFriend,
    takePlan: takePlan,
    getUserDetails: getUserDetails,
    getGroupDetails: getGroupDetails,
    updateGroupPreference: updateGroupPreference,
    getTransactions: getTransactions,
    findCommonGroups: findCommonGroups,
    getGroupWalletByGroupId: getGroupWalletByGroupId
};
//# sourceMappingURL=user.service.js.map