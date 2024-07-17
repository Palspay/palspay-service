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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var constant_1 = require("../constants/constant");
var httpStatus = require('http-status');
var ApiError = require('../utills/ApiError');
var User = require('../models/user.model');
var Expanse = require('../models/expanse.model');
var mongoose = require('mongoose');
// @ts-ignore
var GroupMember = require('../models/group-members.model');
var ObjectId = mongoose.Types.ObjectId;
var activityService = require('./activity.service');
var createExpanse = function (expanseData) { return __awaiter(void 0, void 0, void 0, function () {
    var imagesArray, _a, _b, _c, item, e_1_1, expense, obj, error_1;
    var _d, e_1, _e, _f;
    var _g;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0:
                _h.trys.push([0, 15, , 16]);
                imagesArray = [];
                if (!(((_g = expanseData === null || expanseData === void 0 ? void 0 : expanseData.imageArray) === null || _g === void 0 ? void 0 : _g.length) > 0)) return [3 /*break*/, 12];
                _h.label = 1;
            case 1:
                _h.trys.push([1, 6, 7, 12]);
                _a = true, _b = __asyncValues(expanseData.imageArray);
                _h.label = 2;
            case 2: return [4 /*yield*/, _b.next()];
            case 3:
                if (!(_c = _h.sent(), _d = _c.done, !_d)) return [3 /*break*/, 5];
                _f = _c.value;
                _a = false;
                item = _f;
                imagesArray.push({
                    imgS3Key: 'expanseImages/' + item.imgName,
                    imgName: item.imgName,
                    isPrimary: false
                });
                _h.label = 4;
            case 4:
                _a = true;
                return [3 /*break*/, 2];
            case 5: return [3 /*break*/, 12];
            case 6:
                e_1_1 = _h.sent();
                e_1 = { error: e_1_1 };
                return [3 /*break*/, 12];
            case 7:
                _h.trys.push([7, , 10, 11]);
                if (!(!_a && !_d && (_e = _b.return))) return [3 /*break*/, 9];
                return [4 /*yield*/, _e.call(_b)];
            case 8:
                _h.sent();
                _h.label = 9;
            case 9: return [3 /*break*/, 11];
            case 10:
                if (e_1) throw e_1.error;
                return [7 /*endfinally*/];
            case 11: return [7 /*endfinally*/];
            case 12:
                expanseData['imagesArray'] = imagesArray;
                expense = new Expanse(expanseData);
                obj = {
                    description: 'You added an expense ' + expanseData.description,
                    user_id: expanseData.userId
                };
                return [4 /*yield*/, activityService.createActivity(obj)];
            case 13:
                _h.sent();
                return [4 /*yield*/, expense.save()];
            case 14: return [2 /*return*/, _h.sent()];
            case 15:
                error_1 = _h.sent();
                console.log(error_1);
                throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
            case 16: return [2 /*return*/];
        }
    });
}); };
var updateExpanse = function (expanseData) { return __awaiter(void 0, void 0, void 0, function () {
    var imagesArray, _a, _b, _c, item, e_2_1, expense, error_2;
    var _d, e_2, _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                _g.trys.push([0, 15, , 16]);
                expanseData['userId'] = expanseData.userId;
                imagesArray = [];
                if (!(expanseData.imageArray.length > 0)) return [3 /*break*/, 12];
                _g.label = 1;
            case 1:
                _g.trys.push([1, 6, 7, 12]);
                _a = true, _b = __asyncValues(expanseData.imageArray);
                _g.label = 2;
            case 2: return [4 /*yield*/, _b.next()];
            case 3:
                if (!(_c = _g.sent(), _d = _c.done, !_d)) return [3 /*break*/, 5];
                _f = _c.value;
                _a = false;
                item = _f;
                imagesArray.push({
                    imgS3Key: 'expanseImages/' + item.imgName,
                    imgName: item.imgName,
                    isPrimary: false
                });
                _g.label = 4;
            case 4:
                _a = true;
                return [3 /*break*/, 2];
            case 5: return [3 /*break*/, 12];
            case 6:
                e_2_1 = _g.sent();
                e_2 = { error: e_2_1 };
                return [3 /*break*/, 12];
            case 7:
                _g.trys.push([7, , 10, 11]);
                if (!(!_a && !_d && (_e = _b.return))) return [3 /*break*/, 9];
                return [4 /*yield*/, _e.call(_b)];
            case 8:
                _g.sent();
                _g.label = 9;
            case 9: return [3 /*break*/, 11];
            case 10:
                if (e_2) throw e_2.error;
                return [7 /*endfinally*/];
            case 11: return [7 /*endfinally*/];
            case 12:
                expanseData['_id'] = expanseData.expanseId;
                expanseData['imagesArray'] = imagesArray;
                return [4 /*yield*/, Expanse.deleteOne({ _id: new ObjectId(expanseData.expanseId) })];
            case 13:
                _g.sent();
                expense = new Expanse(expanseData);
                return [4 /*yield*/, expense.save()];
            case 14: return [2 /*return*/, _g.sent()];
            case 15:
                error_2 = _g.sent();
                console.log(error_2);
                throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
            case 16: return [2 /*return*/];
        }
    });
}); };
var deleteExpanse = function (expanseData) { return __awaiter(void 0, void 0, void 0, function () {
    var expanse, obj, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, Expanse.findByIdAndUpdate({ _id: new ObjectId(expanseData.expanseId) }, { $set: { is_deleted: true } }, { new: true, useFindAndModify: false }).lean()];
            case 1:
                expanse = _a.sent();
                obj = {
                    description: 'you delete' + expanse.description + ' expanse sucessfully',
                    user_id: expanseData.userId
                };
                return [4 /*yield*/, activityService.createActivity(obj)];
            case 2:
                _a.sent();
                return [2 /*return*/, true];
            case 3:
                error_3 = _a.sent();
                console.log(error_3);
                throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
            case 4: return [2 /*return*/];
        }
    });
}); };
var getGroupExpanse = function (userData) { return __awaiter(void 0, void 0, void 0, function () {
    var groupId, agg, expanse, dataArr, expanseList, groupsMembers, totalExpanse, groupsMembersCount, equalShare, memberAmounts_1, resultArray, memberId, owesYou, youOwe, amountPaid, balances, balance, error_4;
    var _a, _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 2, , 3]);
                groupId = userData.groupId;
                agg = void 0;
                agg = [
                    { $match: { groupId: groupId }, },
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
                                    addPayer: "$addPayer",
                                    createdAt: "$createdAt",
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
                    {
                        $sort: {
                            createdAt: -1,
                        },
                    },
                ];
                return [4 /*yield*/, Expanse.aggregate(agg)];
            case 1:
                expanse = _e.sent();
                if (expanse.length == 0) {
                    return [2 /*return*/, []];
                }
                dataArr = [];
                expanseList = (_a = expanse[0]) === null || _a === void 0 ? void 0 : _a.expanseList;
                groupsMembers = (_b = expanse[0]) === null || _b === void 0 ? void 0 : _b.groupsMembers;
                totalExpanse = (_c = expanse[0]) === null || _c === void 0 ? void 0 : _c.total;
                groupsMembersCount = (_d = expanse[0]) === null || _d === void 0 ? void 0 : _d.groupsMembersCount;
                equalShare = totalExpanse / groupsMembersCount;
                memberAmounts_1 = {};
                groupsMembers.forEach(function (memberId) {
                    memberAmounts_1[memberId] = 0;
                });
                expanseList.forEach(function (expense) {
                    expense.addPayer.forEach(function (payer) { return __awaiter(void 0, void 0, void 0, function () {
                        var payerId, amount, data;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    payerId = payer.from;
                                    amount = payer.amount;
                                    // Add the amount to the corresponding member in memberAmounts
                                    memberAmounts_1[payerId] += amount;
                                    return [4 /*yield*/, User.findOne(payer.from, { name: 1 }).lean()];
                                case 1:
                                    data = _a.sent();
                                    payer.name = data ? data.name : "--";
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                });
                resultArray = [];
                for (memberId in memberAmounts_1) {
                    owesYou = 0;
                    youOwe = 0;
                    amountPaid = memberAmounts_1[memberId];
                    balances = parseFloat(equalShare).toFixed(2) - parseFloat(amountPaid).toFixed(2);
                    balance = balances.toFixed(2);
                    // @ts-ignore
                    if (balance > 0) {
                        // @ts-ignore
                        owesYou = balance;
                        // @ts-ignore
                    }
                    else if (balance < 0) {
                        // @ts-ignore
                        youOwe = balance;
                    }
                    resultArray.push({ memberId: memberId, amountPaid: amountPaid, equalShare: Number(equalShare.toFixed(2)), owesYou: Number(owesYou), youOwe: Number(youOwe) });
                }
                // expanse[0].youOwe = resultArray
                return [2 /*return*/, expanse[0]];
            case 2:
                error_4 = _e.sent();
                console.log(error_4, "<<<error");
                throw new ApiError(httpStatus.NOT_FOUND, 'no data found');
            case 3: return [2 /*return*/];
        }
    });
}); };
var fetchExpanse = function (data) { return __awaiter(void 0, void 0, void 0, function () {
    var agg, expanse, lentAmount, borrowedAmount, _a, expanse_1, expanse_1_1, item, non_group, _b, _c, _d, per, e_3_1, _e, _f, _g, per, e_4_1, _h, _j, _k, per, e_5_1, _l, _m, _o, per, e_6_1, _p, _q, _r, per, e_7_1, e_8_1, _s, _t, _u, item, data_1, e_9_1, _v, _w, _x, item, data_2, e_10_1, error_5;
    var _y, e_8, _z, _0, _1, e_3, _2, _3, _4, e_4, _5, _6, _7, e_5, _8, _9, _10, e_6, _11, _12, _13, e_7, _14, _15, _16, e_9, _17, _18, _19, e_10, _20, _21;
    var _22, _23;
    return __generator(this, function (_24) {
        switch (_24.label) {
            case 0:
                _24.trys.push([0, 98, , 99]);
                agg = [
                    { $match: { _id: new ObjectId(data.id), is_deleted: false } },
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
                return [4 /*yield*/, Expanse.aggregate(agg)];
            case 1:
                expanse = _24.sent();
                lentAmount = 0, borrowedAmount = 0;
                _24.label = 2;
            case 2:
                _24.trys.push([2, 67, 68, 73]);
                _a = true, expanse_1 = __asyncValues(expanse);
                _24.label = 3;
            case 3: return [4 /*yield*/, expanse_1.next()];
            case 4:
                if (!(expanse_1_1 = _24.sent(), _y = expanse_1_1.done, !_y)) return [3 /*break*/, 66];
                _0 = expanse_1_1.value;
                _a = false;
                item = _0;
                item.you_lent = 0;
                item.you_borrowed = 0;
                non_group = [];
                if (!(item.splitEqually.length > 0)) return [3 /*break*/, 16];
                item['expanseType'] = constant_1.EXPANSE_TYPE.SPLIT_EQUALLY;
                _24.label = 5;
            case 5:
                _24.trys.push([5, 10, 11, 16]);
                _b = true, _c = (e_3 = void 0, __asyncValues(item.splitEqually));
                _24.label = 6;
            case 6: return [4 /*yield*/, _c.next()];
            case 7:
                if (!(_d = _24.sent(), _1 = _d.done, !_1)) return [3 /*break*/, 9];
                _3 = _d.value;
                _b = false;
                per = _3;
                if (per.memberId.toString() == data.userId.toString()) {
                    non_group.push({ type: "owe", memberId: per.memberId, amount: per.amount });
                    if (item.addPayer.every(function (payer) { return data.userId.toString() !== payer.from.toString(); })) {
                        borrowedAmount = parseFloat(per.amount);
                    }
                }
                else {
                    non_group.push({ type: "owes", memberId: per.memberId, amount: per.amount });
                    lentAmount += parseFloat(per.amount);
                }
                _24.label = 8;
            case 8:
                _b = true;
                return [3 /*break*/, 6];
            case 9: return [3 /*break*/, 16];
            case 10:
                e_3_1 = _24.sent();
                e_3 = { error: e_3_1 };
                return [3 /*break*/, 16];
            case 11:
                _24.trys.push([11, , 14, 15]);
                if (!(!_b && !_1 && (_2 = _c.return))) return [3 /*break*/, 13];
                return [4 /*yield*/, _2.call(_c)];
            case 12:
                _24.sent();
                _24.label = 13;
            case 13: return [3 /*break*/, 15];
            case 14:
                if (e_3) throw e_3.error;
                return [7 /*endfinally*/];
            case 15: return [7 /*endfinally*/];
            case 16:
                if (!(item.splitUnequally.length > 0)) return [3 /*break*/, 28];
                item['expanseType'] = constant_1.EXPANSE_TYPE.SPLIT_UNEQUALLY;
                _24.label = 17;
            case 17:
                _24.trys.push([17, 22, 23, 28]);
                _e = true, _f = (e_4 = void 0, __asyncValues(item.splitUnequally));
                _24.label = 18;
            case 18: return [4 /*yield*/, _f.next()];
            case 19:
                if (!(_g = _24.sent(), _4 = _g.done, !_4)) return [3 /*break*/, 21];
                _6 = _g.value;
                _e = false;
                per = _6;
                if (per.memberId.toString() == data.userId.toString()) {
                    non_group.push({ type: "owe", memberId: per.memberId, amount: per.amount });
                    if (item.addPayer.every(function (payer) { return data.userId.toString() !== payer.from.toString(); })) {
                        borrowedAmount = parseFloat(per.amount);
                    }
                }
                else {
                    non_group.push({ type: "owes", memberId: per.memberId, amount: per.amount });
                    lentAmount += parseFloat(per.amount);
                }
                _24.label = 20;
            case 20:
                _e = true;
                return [3 /*break*/, 18];
            case 21: return [3 /*break*/, 28];
            case 22:
                e_4_1 = _24.sent();
                e_4 = { error: e_4_1 };
                return [3 /*break*/, 28];
            case 23:
                _24.trys.push([23, , 26, 27]);
                if (!(!_e && !_4 && (_5 = _f.return))) return [3 /*break*/, 25];
                return [4 /*yield*/, _5.call(_f)];
            case 24:
                _24.sent();
                _24.label = 25;
            case 25: return [3 /*break*/, 27];
            case 26:
                if (e_4) throw e_4.error;
                return [7 /*endfinally*/];
            case 27: return [7 /*endfinally*/];
            case 28:
                if (!(item.splitByPercentage.length > 0)) return [3 /*break*/, 40];
                item['expanseType'] = constant_1.EXPANSE_TYPE.SPLIT_BY_PERCENTAGE;
                _24.label = 29;
            case 29:
                _24.trys.push([29, 34, 35, 40]);
                _h = true, _j = (e_5 = void 0, __asyncValues(item.splitByPercentage));
                _24.label = 30;
            case 30: return [4 /*yield*/, _j.next()];
            case 31:
                if (!(_k = _24.sent(), _7 = _k.done, !_7)) return [3 /*break*/, 33];
                _9 = _k.value;
                _h = false;
                per = _9;
                if (per.memberId.toString() == data.userId.toString()) {
                    non_group.push({ type: "owe", memberId: per.memberId, amount: per.amount });
                    if (item.addPayer.every(function (payer) { return data.userId.toString() !== payer.from.toString(); })) {
                        borrowedAmount = parseFloat(per.amount);
                    }
                }
                else {
                    non_group.push({ type: "owes", memberId: per.memberId, amount: per.amount });
                    lentAmount += parseFloat(per.amount);
                }
                _24.label = 32;
            case 32:
                _h = true;
                return [3 /*break*/, 30];
            case 33: return [3 /*break*/, 40];
            case 34:
                e_5_1 = _24.sent();
                e_5 = { error: e_5_1 };
                return [3 /*break*/, 40];
            case 35:
                _24.trys.push([35, , 38, 39]);
                if (!(!_h && !_7 && (_8 = _j.return))) return [3 /*break*/, 37];
                return [4 /*yield*/, _8.call(_j)];
            case 36:
                _24.sent();
                _24.label = 37;
            case 37: return [3 /*break*/, 39];
            case 38:
                if (e_5) throw e_5.error;
                return [7 /*endfinally*/];
            case 39: return [7 /*endfinally*/];
            case 40:
                if (!(item.splitByShare.length > 0)) return [3 /*break*/, 52];
                item['expanseType'] = constant_1.EXPANSE_TYPE.SPLIT_BY_SHARE;
                _24.label = 41;
            case 41:
                _24.trys.push([41, 46, 47, 52]);
                _l = true, _m = (e_6 = void 0, __asyncValues(item.splitByShare));
                _24.label = 42;
            case 42: return [4 /*yield*/, _m.next()];
            case 43:
                if (!(_o = _24.sent(), _10 = _o.done, !_10)) return [3 /*break*/, 45];
                _12 = _o.value;
                _l = false;
                per = _12;
                if (per.memberId.toString() == data.userId.toString()) {
                    non_group.push({ type: "owe", memberId: per.memberId, amount: per.amount });
                    if (item.addPayer.every(function (payer) { return data.userId.toString() !== payer.from.toString(); })) {
                        borrowedAmount = parseFloat(per.amount);
                    }
                }
                else {
                    non_group.push({ type: "owes", memberId: per.memberId, amount: per.amount });
                    lentAmount += parseFloat(per.amount);
                }
                _24.label = 44;
            case 44:
                _l = true;
                return [3 /*break*/, 42];
            case 45: return [3 /*break*/, 52];
            case 46:
                e_6_1 = _24.sent();
                e_6 = { error: e_6_1 };
                return [3 /*break*/, 52];
            case 47:
                _24.trys.push([47, , 50, 51]);
                if (!(!_l && !_10 && (_11 = _m.return))) return [3 /*break*/, 49];
                return [4 /*yield*/, _11.call(_m)];
            case 48:
                _24.sent();
                _24.label = 49;
            case 49: return [3 /*break*/, 51];
            case 50:
                if (e_6) throw e_6.error;
                return [7 /*endfinally*/];
            case 51: return [7 /*endfinally*/];
            case 52:
                if (!(item.splitByAdjustments.length > 0)) return [3 /*break*/, 64];
                item['expanseType'] = constant_1.EXPANSE_TYPE.SPLIT_BY_ADJUSTMENT;
                _24.label = 53;
            case 53:
                _24.trys.push([53, 58, 59, 64]);
                _p = true, _q = (e_7 = void 0, __asyncValues(item.splitByAdjustments));
                _24.label = 54;
            case 54: return [4 /*yield*/, _q.next()];
            case 55:
                if (!(_r = _24.sent(), _13 = _r.done, !_13)) return [3 /*break*/, 57];
                _15 = _r.value;
                _p = false;
                per = _15;
                if (per.memberId.toString() == data.userId.toString()) {
                    non_group.push({ type: "owe", memberId: per.memberId, amount: per.amount });
                    if (item.addPayer.every(function (payer) { return data.userId.toString() !== payer.from.toString(); })) {
                        borrowedAmount = parseFloat(per.amount);
                    }
                }
                else {
                    non_group.push({ type: "owes", memberId: per.memberId, amount: per.amount });
                    lentAmount += parseFloat(per.amount);
                }
                _24.label = 56;
            case 56:
                _p = true;
                return [3 /*break*/, 54];
            case 57: return [3 /*break*/, 64];
            case 58:
                e_7_1 = _24.sent();
                e_7 = { error: e_7_1 };
                return [3 /*break*/, 64];
            case 59:
                _24.trys.push([59, , 62, 63]);
                if (!(!_p && !_13 && (_14 = _q.return))) return [3 /*break*/, 61];
                return [4 /*yield*/, _14.call(_q)];
            case 60:
                _24.sent();
                _24.label = 61;
            case 61: return [3 /*break*/, 63];
            case 62:
                if (e_7) throw e_7.error;
                return [7 /*endfinally*/];
            case 63: return [7 /*endfinally*/];
            case 64:
                item.expanse_details = non_group;
                if (item.addPayer.every(function (payer) { return data.userId.toString() !== payer.from.toString(); })) {
                    item.you_borrowed = borrowedAmount.toFixed(2);
                }
                else {
                    item.you_lent = lentAmount.toFixed(2);
                }
                _24.label = 65;
            case 65:
                _a = true;
                return [3 /*break*/, 3];
            case 66: return [3 /*break*/, 73];
            case 67:
                e_8_1 = _24.sent();
                e_8 = { error: e_8_1 };
                return [3 /*break*/, 73];
            case 68:
                _24.trys.push([68, , 71, 72]);
                if (!(!_a && !_y && (_z = expanse_1.return))) return [3 /*break*/, 70];
                return [4 /*yield*/, _z.call(expanse_1)];
            case 69:
                _24.sent();
                _24.label = 70;
            case 70: return [3 /*break*/, 72];
            case 71:
                if (e_8) throw e_8.error;
                return [7 /*endfinally*/];
            case 72: return [7 /*endfinally*/];
            case 73:
                _24.trys.push([73, 79, 80, 85]);
                _s = true, _t = __asyncValues((_22 = expanse[0]) === null || _22 === void 0 ? void 0 : _22.expanse_details);
                _24.label = 74;
            case 74: return [4 /*yield*/, _t.next()];
            case 75:
                if (!(_u = _24.sent(), _16 = _u.done, !_16)) return [3 /*break*/, 78];
                _18 = _u.value;
                _s = false;
                item = _18;
                return [4 /*yield*/, User.findOne(item.memberId, { name: 1 }).lean()];
            case 76:
                data_1 = _24.sent();
                item.name = data_1 ? data_1.name : "--";
                _24.label = 77;
            case 77:
                _s = true;
                return [3 /*break*/, 74];
            case 78: return [3 /*break*/, 85];
            case 79:
                e_9_1 = _24.sent();
                e_9 = { error: e_9_1 };
                return [3 /*break*/, 85];
            case 80:
                _24.trys.push([80, , 83, 84]);
                if (!(!_s && !_16 && (_17 = _t.return))) return [3 /*break*/, 82];
                return [4 /*yield*/, _17.call(_t)];
            case 81:
                _24.sent();
                _24.label = 82;
            case 82: return [3 /*break*/, 84];
            case 83:
                if (e_9) throw e_9.error;
                return [7 /*endfinally*/];
            case 84: return [7 /*endfinally*/];
            case 85:
                _24.trys.push([85, 91, 92, 97]);
                _v = true, _w = __asyncValues((_23 = expanse[0]) === null || _23 === void 0 ? void 0 : _23.addPayer);
                _24.label = 86;
            case 86: return [4 /*yield*/, _w.next()];
            case 87:
                if (!(_x = _24.sent(), _19 = _x.done, !_19)) return [3 /*break*/, 90];
                _21 = _x.value;
                _v = false;
                item = _21;
                return [4 /*yield*/, User.findOne(item.from, { name: 1 }).lean()];
            case 88:
                data_2 = _24.sent();
                item.name = data_2 ? data_2.name : "--";
                _24.label = 89;
            case 89:
                _v = true;
                return [3 /*break*/, 86];
            case 90: return [3 /*break*/, 97];
            case 91:
                e_10_1 = _24.sent();
                e_10 = { error: e_10_1 };
                return [3 /*break*/, 97];
            case 92:
                _24.trys.push([92, , 95, 96]);
                if (!(!_v && !_19 && (_20 = _w.return))) return [3 /*break*/, 94];
                return [4 /*yield*/, _20.call(_w)];
            case 93:
                _24.sent();
                _24.label = 94;
            case 94: return [3 /*break*/, 96];
            case 95:
                if (e_10) throw e_10.error;
                return [7 /*endfinally*/];
            case 96: return [7 /*endfinally*/];
            case 97: return [2 /*return*/, expanse[0]];
            case 98:
                error_5 = _24.sent();
                console.log(error_5, "<<error");
                throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
            case 99: return [2 /*return*/];
        }
    });
}); };
var individualExpanse = function (data) { return __awaiter(void 0, void 0, void 0, function () {
    var matchStage, agg, expanse, _a, expanse_2, expanse_2_1, item, lentAmount, borrowedAmount, non_group, _b, _c, _d, per, e_11_1, _e, _f, _g, per, e_12_1, _h, _j, _k, per, e_13_1, _l, _m, _o, per, e_14_1, _p, _q, _r, per, e_15_1, e_16_1, _s, expanse_3, expanse_3_1, exp, _t, _u, _v, item, data_3, e_17_1, _w, _x, _y, obj, data_4, e_18_1, e_19_1, error_6;
    var _z, e_16, _0, _1, _2, e_11, _3, _4, _5, e_12, _6, _7, _8, e_13, _9, _10, _11, e_14, _12, _13, _14, e_15, _15, _16, _17, e_19, _18, _19, _20, e_17, _21, _22, _23, e_18, _24, _25;
    return __generator(this, function (_26) {
        switch (_26.label) {
            case 0:
                matchStage = {
                    $match: {
                        'members.memberId': data.userId,
                        is_deleted: false,
                        groupId: { $eq: "" }
                    }
                };
                if (data.friendId) {
                    matchStage.$match['members.memberId'] = {
                        $all: [
                            data.userId,
                            data.friendId
                        ]
                    };
                }
                _26.label = 1;
            case 1:
                _26.trys.push([1, 110, , 111]);
                agg = [matchStage,
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
                    },
                    {
                        $sort: {
                            createdAt: -1,
                        },
                    },
                ];
                return [4 /*yield*/, Expanse.aggregate(agg)];
            case 2:
                expanse = _26.sent();
                _26.label = 3;
            case 3:
                _26.trys.push([3, 68, 69, 74]);
                _a = true, expanse_2 = __asyncValues(expanse);
                _26.label = 4;
            case 4: return [4 /*yield*/, expanse_2.next()];
            case 5:
                if (!(expanse_2_1 = _26.sent(), _z = expanse_2_1.done, !_z)) return [3 /*break*/, 67];
                _1 = expanse_2_1.value;
                _a = false;
                item = _1;
                lentAmount = 0, borrowedAmount = 0;
                item.you_lent = 0;
                item.you_borrowed = 0;
                non_group = [];
                if (!(item.splitEqually.length > 0)) return [3 /*break*/, 17];
                item['expanseType'] = constant_1.EXPANSE_TYPE.SPLIT_EQUALLY;
                _26.label = 6;
            case 6:
                _26.trys.push([6, 11, 12, 17]);
                _b = true, _c = (e_11 = void 0, __asyncValues(item.splitEqually));
                _26.label = 7;
            case 7: return [4 /*yield*/, _c.next()];
            case 8:
                if (!(_d = _26.sent(), _2 = _d.done, !_2)) return [3 /*break*/, 10];
                _4 = _d.value;
                _b = false;
                per = _4;
                if (per.memberId.toString() == data.userId.toString()) {
                    non_group.push({ type: "owe", memberId: per.memberId, amount: per.amount });
                    if (item.addPayer.every(function (payer) { return data.userId.toString() !== payer.from.toString(); })) {
                        borrowedAmount = parseFloat(per.amount);
                    }
                }
                else {
                    non_group.push({ type: "owes", memberId: per.memberId, amount: per.amount });
                    lentAmount += parseFloat(per.amount);
                }
                _26.label = 9;
            case 9:
                _b = true;
                return [3 /*break*/, 7];
            case 10: return [3 /*break*/, 17];
            case 11:
                e_11_1 = _26.sent();
                e_11 = { error: e_11_1 };
                return [3 /*break*/, 17];
            case 12:
                _26.trys.push([12, , 15, 16]);
                if (!(!_b && !_2 && (_3 = _c.return))) return [3 /*break*/, 14];
                return [4 /*yield*/, _3.call(_c)];
            case 13:
                _26.sent();
                _26.label = 14;
            case 14: return [3 /*break*/, 16];
            case 15:
                if (e_11) throw e_11.error;
                return [7 /*endfinally*/];
            case 16: return [7 /*endfinally*/];
            case 17:
                if (!(item.splitUnequally.length > 0)) return [3 /*break*/, 29];
                item['expanseType'] = constant_1.EXPANSE_TYPE.SPLIT_UNEQUALLY;
                _26.label = 18;
            case 18:
                _26.trys.push([18, 23, 24, 29]);
                _e = true, _f = (e_12 = void 0, __asyncValues(item.splitUnequally));
                _26.label = 19;
            case 19: return [4 /*yield*/, _f.next()];
            case 20:
                if (!(_g = _26.sent(), _5 = _g.done, !_5)) return [3 /*break*/, 22];
                _7 = _g.value;
                _e = false;
                per = _7;
                if (per.memberId.toString() == data.userId.toString()) {
                    non_group.push({ type: "owe", memberId: per.memberId, amount: per.amount });
                    if (item.addPayer.every(function (payer) { return data.userId.toString() !== payer.from.toString(); })) {
                        borrowedAmount = parseFloat(per.amount);
                    }
                }
                else {
                    non_group.push({ type: "owes", memberId: per.memberId, amount: per.amount });
                    lentAmount += parseFloat(per.amount);
                }
                _26.label = 21;
            case 21:
                _e = true;
                return [3 /*break*/, 19];
            case 22: return [3 /*break*/, 29];
            case 23:
                e_12_1 = _26.sent();
                e_12 = { error: e_12_1 };
                return [3 /*break*/, 29];
            case 24:
                _26.trys.push([24, , 27, 28]);
                if (!(!_e && !_5 && (_6 = _f.return))) return [3 /*break*/, 26];
                return [4 /*yield*/, _6.call(_f)];
            case 25:
                _26.sent();
                _26.label = 26;
            case 26: return [3 /*break*/, 28];
            case 27:
                if (e_12) throw e_12.error;
                return [7 /*endfinally*/];
            case 28: return [7 /*endfinally*/];
            case 29:
                if (!(item.splitByPercentage.length > 0)) return [3 /*break*/, 41];
                item['expanseType'] = constant_1.EXPANSE_TYPE.SPLIT_BY_PERCENTAGE;
                _26.label = 30;
            case 30:
                _26.trys.push([30, 35, 36, 41]);
                _h = true, _j = (e_13 = void 0, __asyncValues(item.splitByPercentage));
                _26.label = 31;
            case 31: return [4 /*yield*/, _j.next()];
            case 32:
                if (!(_k = _26.sent(), _8 = _k.done, !_8)) return [3 /*break*/, 34];
                _10 = _k.value;
                _h = false;
                per = _10;
                if (per.memberId.toString() == data.userId.toString()) {
                    non_group.push({ type: "owe", memberId: per.memberId, amount: per.amount });
                    if (item.addPayer.every(function (payer) { return data.userId.toString() !== payer.from.toString(); })) {
                        borrowedAmount = parseFloat(per.amount);
                    }
                }
                else {
                    non_group.push({ type: "owes", memberId: per.memberId, amount: per.amount });
                    lentAmount += parseFloat(per.amount);
                }
                _26.label = 33;
            case 33:
                _h = true;
                return [3 /*break*/, 31];
            case 34: return [3 /*break*/, 41];
            case 35:
                e_13_1 = _26.sent();
                e_13 = { error: e_13_1 };
                return [3 /*break*/, 41];
            case 36:
                _26.trys.push([36, , 39, 40]);
                if (!(!_h && !_8 && (_9 = _j.return))) return [3 /*break*/, 38];
                return [4 /*yield*/, _9.call(_j)];
            case 37:
                _26.sent();
                _26.label = 38;
            case 38: return [3 /*break*/, 40];
            case 39:
                if (e_13) throw e_13.error;
                return [7 /*endfinally*/];
            case 40: return [7 /*endfinally*/];
            case 41:
                if (!(item.splitByShare.length > 0)) return [3 /*break*/, 53];
                item['expanseType'] = constant_1.EXPANSE_TYPE.SPLIT_BY_SHARE;
                _26.label = 42;
            case 42:
                _26.trys.push([42, 47, 48, 53]);
                _l = true, _m = (e_14 = void 0, __asyncValues(item.splitByShare));
                _26.label = 43;
            case 43: return [4 /*yield*/, _m.next()];
            case 44:
                if (!(_o = _26.sent(), _11 = _o.done, !_11)) return [3 /*break*/, 46];
                _13 = _o.value;
                _l = false;
                per = _13;
                if (per.memberId.toString() == data.userId.toString()) {
                    non_group.push({ type: "owe", memberId: per.memberId, amount: per.amount });
                    if (item.addPayer.every(function (payer) { return data.userId.toString() !== payer.from.toString(); })) {
                        borrowedAmount = parseFloat(per.amount);
                    }
                }
                else {
                    non_group.push({ type: "owes", memberId: per.memberId, amount: per.amount });
                    lentAmount += parseFloat(per.amount);
                }
                _26.label = 45;
            case 45:
                _l = true;
                return [3 /*break*/, 43];
            case 46: return [3 /*break*/, 53];
            case 47:
                e_14_1 = _26.sent();
                e_14 = { error: e_14_1 };
                return [3 /*break*/, 53];
            case 48:
                _26.trys.push([48, , 51, 52]);
                if (!(!_l && !_11 && (_12 = _m.return))) return [3 /*break*/, 50];
                return [4 /*yield*/, _12.call(_m)];
            case 49:
                _26.sent();
                _26.label = 50;
            case 50: return [3 /*break*/, 52];
            case 51:
                if (e_14) throw e_14.error;
                return [7 /*endfinally*/];
            case 52: return [7 /*endfinally*/];
            case 53:
                if (!(item.splitByAdjustments.length > 0)) return [3 /*break*/, 65];
                item['expanseType'] = constant_1.EXPANSE_TYPE.SPLIT_BY_ADJUSTMENT;
                _26.label = 54;
            case 54:
                _26.trys.push([54, 59, 60, 65]);
                _p = true, _q = (e_15 = void 0, __asyncValues(item.splitByAdjustments));
                _26.label = 55;
            case 55: return [4 /*yield*/, _q.next()];
            case 56:
                if (!(_r = _26.sent(), _14 = _r.done, !_14)) return [3 /*break*/, 58];
                _16 = _r.value;
                _p = false;
                per = _16;
                if (per.memberId.toString() == data.userId.toString()) {
                    non_group.push({ type: "owe", memberId: per.memberId, amount: per.amount });
                    if (item.addPayer.every(function (payer) { return data.userId.toString() !== payer.from.toString(); })) {
                        borrowedAmount = parseFloat(per.amount);
                    }
                }
                else {
                    non_group.push({ type: "owes", memberId: per.memberId, amount: per.amount });
                    lentAmount += parseFloat(per.amount);
                }
                _26.label = 57;
            case 57:
                _p = true;
                return [3 /*break*/, 55];
            case 58: return [3 /*break*/, 65];
            case 59:
                e_15_1 = _26.sent();
                e_15 = { error: e_15_1 };
                return [3 /*break*/, 65];
            case 60:
                _26.trys.push([60, , 63, 64]);
                if (!(!_p && !_14 && (_15 = _q.return))) return [3 /*break*/, 62];
                return [4 /*yield*/, _15.call(_q)];
            case 61:
                _26.sent();
                _26.label = 62;
            case 62: return [3 /*break*/, 64];
            case 63:
                if (e_15) throw e_15.error;
                return [7 /*endfinally*/];
            case 64: return [7 /*endfinally*/];
            case 65:
                item.expanse_details = non_group;
                if (item.addPayer.every(function (payer) { return data.userId.toString() !== payer.from.toString(); })) {
                    item.you_borrowed = borrowedAmount.toFixed(2);
                }
                else {
                    item.you_lent = lentAmount.toFixed(2);
                }
                _26.label = 66;
            case 66:
                _a = true;
                return [3 /*break*/, 4];
            case 67: return [3 /*break*/, 74];
            case 68:
                e_16_1 = _26.sent();
                e_16 = { error: e_16_1 };
                return [3 /*break*/, 74];
            case 69:
                _26.trys.push([69, , 72, 73]);
                if (!(!_a && !_z && (_0 = expanse_2.return))) return [3 /*break*/, 71];
                return [4 /*yield*/, _0.call(expanse_2)];
            case 70:
                _26.sent();
                _26.label = 71;
            case 71: return [3 /*break*/, 73];
            case 72:
                if (e_16) throw e_16.error;
                return [7 /*endfinally*/];
            case 73: return [7 /*endfinally*/];
            case 74:
                _26.trys.push([74, 103, 104, 109]);
                _s = true, expanse_3 = __asyncValues(expanse);
                _26.label = 75;
            case 75: return [4 /*yield*/, expanse_3.next()];
            case 76:
                if (!(expanse_3_1 = _26.sent(), _17 = expanse_3_1.done, !_17)) return [3 /*break*/, 102];
                _19 = expanse_3_1.value;
                _s = false;
                exp = _19;
                _26.label = 77;
            case 77:
                _26.trys.push([77, 83, 84, 89]);
                _t = true, _u = (e_17 = void 0, __asyncValues(exp.expanse_details));
                _26.label = 78;
            case 78: return [4 /*yield*/, _u.next()];
            case 79:
                if (!(_v = _26.sent(), _20 = _v.done, !_20)) return [3 /*break*/, 82];
                _22 = _v.value;
                _t = false;
                item = _22;
                return [4 /*yield*/, User.findOne(item.memberId, { name: 1 }).lean()];
            case 80:
                data_3 = _26.sent();
                item.name = data_3 ? data_3.name : "--";
                _26.label = 81;
            case 81:
                _t = true;
                return [3 /*break*/, 78];
            case 82: return [3 /*break*/, 89];
            case 83:
                e_17_1 = _26.sent();
                e_17 = { error: e_17_1 };
                return [3 /*break*/, 89];
            case 84:
                _26.trys.push([84, , 87, 88]);
                if (!(!_t && !_20 && (_21 = _u.return))) return [3 /*break*/, 86];
                return [4 /*yield*/, _21.call(_u)];
            case 85:
                _26.sent();
                _26.label = 86;
            case 86: return [3 /*break*/, 88];
            case 87:
                if (e_17) throw e_17.error;
                return [7 /*endfinally*/];
            case 88: return [7 /*endfinally*/];
            case 89:
                _26.trys.push([89, 95, 96, 101]);
                _w = true, _x = (e_18 = void 0, __asyncValues(exp.addPayer));
                _26.label = 90;
            case 90: return [4 /*yield*/, _x.next()];
            case 91:
                if (!(_y = _26.sent(), _23 = _y.done, !_23)) return [3 /*break*/, 94];
                _25 = _y.value;
                _w = false;
                obj = _25;
                return [4 /*yield*/, User.findOne(obj.from, { name: 1 }).lean()];
            case 92:
                data_4 = _26.sent();
                obj.name = data_4 ? data_4.name : "--";
                _26.label = 93;
            case 93:
                _w = true;
                return [3 /*break*/, 90];
            case 94: return [3 /*break*/, 101];
            case 95:
                e_18_1 = _26.sent();
                e_18 = { error: e_18_1 };
                return [3 /*break*/, 101];
            case 96:
                _26.trys.push([96, , 99, 100]);
                if (!(!_w && !_23 && (_24 = _x.return))) return [3 /*break*/, 98];
                return [4 /*yield*/, _24.call(_x)];
            case 97:
                _26.sent();
                _26.label = 98;
            case 98: return [3 /*break*/, 100];
            case 99:
                if (e_18) throw e_18.error;
                return [7 /*endfinally*/];
            case 100: return [7 /*endfinally*/];
            case 101:
                _s = true;
                return [3 /*break*/, 75];
            case 102: return [3 /*break*/, 109];
            case 103:
                e_19_1 = _26.sent();
                e_19 = { error: e_19_1 };
                return [3 /*break*/, 109];
            case 104:
                _26.trys.push([104, , 107, 108]);
                if (!(!_s && !_17 && (_18 = expanse_3.return))) return [3 /*break*/, 106];
                return [4 /*yield*/, _18.call(expanse_3)];
            case 105:
                _26.sent();
                _26.label = 106;
            case 106: return [3 /*break*/, 108];
            case 107:
                if (e_19) throw e_19.error;
                return [7 /*endfinally*/];
            case 108: return [7 /*endfinally*/];
            case 109: return [2 /*return*/, expanse];
            case 110:
                error_6 = _26.sent();
                console.log(error_6, "<<error");
                throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
            case 111: return [2 /*return*/];
        }
    });
}); };
var getGroupByUser = function (userData) { return __awaiter(void 0, void 0, void 0, function () {
    var agg, expanse, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                agg = void 0;
                agg = [
                    { $match: { groupId: { $ne: '' }, "members.memberId": userData.userId, is_deleted: false } },
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
                    { $unwind: { path: "$usersDetail", preserveNullAndEmptyArrays: true } },
                    { "$lookup": { "from": "groups", "localField": "groupIdObjectId", "foreignField": "_id", "as": "groupsdetails" } },
                    { $unwind: { path: "$groupsdetails", preserveNullAndEmptyArrays: true } },
                    {
                        $group: {
                            _id: { groupId: "$groupId" },
                            groupId: { $first: "$groupId" },
                            group_name: { $first: "$groupsdetails.group_name" },
                            expanseList: {
                                $push: {
                                    _id: "$_id",
                                    total: "$totalExpanse",
                                    groupId: "$groupId",
                                    addedBy: "$usersDetail.name",
                                    description: {
                                        $cond: { if: "$description", then: "$description", else: "" }
                                    },
                                    createdAt: "$createdAt",
                                }
                            },
                            groupsMembers: { $first: "$membersDetails._id" },
                            totalExpanse: { $sum: "$totalExpanse" },
                        },
                    },
                    // {
                    //     $addFields: {
                    //         expanseList: { $slice: ["$expanseList", { $subtract: [{ $size: "$expanseList" }, 1] }, 1] },
                    //         recentExpanse: { $arrayElemAt: ["$expanseList", 0] },
                    //     }
                    // },
                    {
                        "$project": {
                            _id: 0,
                            groupId: 1,
                            group_name: 1,
                            expanseList: 1,
                            groupsMembers: 1,
                            totalExpanse: 1,
                        }
                    },
                ];
                return [4 /*yield*/, Expanse.aggregate(agg)];
            case 1:
                expanse = _a.sent();
                return [2 /*return*/, expanse];
            case 2:
                error_7 = _a.sent();
                console.log(error_7, "<<error");
                throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
            case 3: return [2 /*return*/];
        }
    });
}); };
module.exports = {
    createExpanse: createExpanse,
    updateExpanse: updateExpanse,
    getGroupExpanse: getGroupExpanse,
    fetchExpanse: fetchExpanse,
    deleteExpanse: deleteExpanse,
    individualExpanse: individualExpanse,
    getGroupByUser: getGroupByUser
};
//# sourceMappingURL=expanse.service.js.map