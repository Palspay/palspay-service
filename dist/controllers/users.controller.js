"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var httpStatus = require('http-status');
var catchAsync = require('./../utills/catchAsync');
var userService = require('./../services').userService;
var multer = require('multer');
var path = require('path');
var fs = require('fs');
// const { use } = require('../routes/v1/user.routes');
var activityService = require('./../services/activity.service');
// @ts-ignore
var isGroupMember = require('../validations/dynamicValidation/dynamic.validations').isGroupMember;
var findCommonGroups = require('../services/user.service').findCommonGroups;
var getGroupWalletByGroupId = require('../services/user.service').getGroupWalletByGroupId;
var ReportedUser = require('../models/reportedUser.model');
var User = require('../models/user.model');
var addFriends = catchAsync(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var mergedBody, invite_details;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                mergedBody = __assign(__assign({}, req.body), { userId: req.userId, currentDate: req.currentDate });
                return [4 /*yield*/, userService.addFriends(mergedBody)];
            case 1:
                invite_details = _a.sent();
                res.status(httpStatus.CREATED).send({ message: 'Add friend succesfully', data: { invite_details: invite_details } });
                return [2 /*return*/];
        }
    });
}); });
var getFriends = catchAsync(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var friends;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, userService.getFriendsById(req.userId)];
            case 1:
                friends = _a.sent();
                res.status(httpStatus.OK).send({ message: 'Friends List', data: { friends: friends } });
                return [2 /*return*/];
        }
    });
}); });
var createGroups = catchAsync(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var mergedBody, group_id;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                mergedBody = __assign(__assign({}, req.body), { userId: req.userId, currentDate: req.currentDate });
                return [4 /*yield*/, userService.createGroups(mergedBody)];
            case 1:
                group_id = _a.sent();
                res.status(httpStatus.CREATED).send({ message: 'Group Create succesfully', data: { group_id: group_id._id } });
                return [2 /*return*/];
        }
    });
}); });
var groupSettings = catchAsync(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var mergedBody, updatedGroup;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                mergedBody = {
                    userId: req.userId,
                    owner_only_payment: req.body.owner_only_payment,
                    group_name: req.body.group_name,
                    group_icon: req.body.group_icon,
                    groupId: req.params.group_id,
                    currentDate: req.currentDate
                };
                return [4 /*yield*/, userService.updateGroupPreference(mergedBody)];
            case 1:
                updatedGroup = _a.sent();
                res.status(httpStatus.OK).send({ message: 'Group Settings updated', data: updatedGroup });
                return [2 /*return*/];
        }
    });
}); });
var getMembersByGroupId = catchAsync(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var mergedBody, groupsDetails;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                mergedBody = __assign(__assign({}, req.body), { userId: req.userId, groupId: req.params.group_id, currentDate: req.currentDate });
                return [4 /*yield*/, userService.getMembersByGroupId(mergedBody)];
            case 1:
                groupsDetails = _a.sent();
                res.status(httpStatus.OK).send({ message: 'Group details fetched succesfully', data: { groupsDetails: groupsDetails } });
                return [2 /*return*/];
        }
    });
}); });
var getMyGroups = catchAsync(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var groupsList;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, userService.getMyGroups(req.userId)];
            case 1:
                groupsList = _a.sent();
                res.status(httpStatus.OK).send({ message: 'Group list fetched succesfully', data: { groupsList: groupsList } });
                return [2 /*return*/];
        }
    });
}); });
var getUserDetails = catchAsync(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, userDetails;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = req.params.user_id;
                return [4 /*yield*/, userService.getUserDetails(userId)];
            case 1:
                userDetails = _a.sent();
                res.status(httpStatus.OK).send({ message: 'User details fetched succesfully', data: userDetails });
                return [2 /*return*/];
        }
    });
}); });
var setPasscode = catchAsync(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var mergedBody, passcode;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                mergedBody = __assign(__assign({}, req.body), { userId: req.userId, currentDate: req.currentDate });
                return [4 /*yield*/, userService.setPasscode(mergedBody)];
            case 1:
                passcode = _a.sent();
                res.status(httpStatus.OK).send({ message: 'Passcode set succesfully', data: {} });
                return [2 /*return*/];
        }
    });
}); });
var getAllTimezones = catchAsync(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var timezones;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, userService.getAllTimezones()];
            case 1:
                timezones = _a.sent();
                res.status(httpStatus.OK).send({ message: 'Data Load succesfully', data: { timezones: timezones } });
                return [2 /*return*/];
        }
    });
}); });
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        var uploadPath = path.join(__dirname, '../../public/uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        var uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        var ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    },
});
var upload = multer({ storage: storage });
var uploadFile = catchAsync(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        upload.single('file')(req, res, function (err) {
            if (err) {
                res.status(httpStatus.BAD_REQUEST).send({ message: 'File upload failed', data: {} });
            }
            if (!req.file) {
                res.status(httpStatus.BAD_REQUEST).send({ message: 'File upload failed', data: {} });
            }
            var releativePath = path.join(req.file.filename);
            res.json({ message: 'File uploaded successfully', imagePath: releativePath });
        });
        return [2 /*return*/];
    });
}); });
var uploadUserProfilePicture = catchAsync(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        upload.single('file')(req, res, function (err) { return __awaiter(void 0, void 0, void 0, function () {
            var relativePath, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (err) {
                            return [2 /*return*/, res.status(httpStatus.BAD_REQUEST).send({ message: 'File upload failed', data: {} })];
                        }
                        if (!req.file) {
                            return [2 /*return*/, res.status(httpStatus.BAD_REQUEST).send({ message: 'File upload failed', data: {} })];
                        }
                        relativePath = "https://app.palspayapp.com/v1/users/uploads/".concat(req.file.filename);
                        return [4 /*yield*/, User.findById(req.userId)];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            return [2 /*return*/, res.status(httpStatus.NOT_FOUND).send({ message: 'User not found', data: {} })];
                        }
                        user.dp = relativePath;
                        return [4 /*yield*/, user.save()];
                    case 2:
                        _a.sent();
                        res.status(httpStatus.OK).json({ message: 'File uploaded successfully', imagePath: relativePath });
                        return [2 /*return*/];
                }
            });
        }); });
        return [2 /*return*/];
    });
}); });
var editProfile = catchAsync(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var mergedBody, profile;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                mergedBody = __assign(__assign({}, req.body), { modification_date: req.currentDate });
                return [4 /*yield*/, userService.editProfile(mergedBody, req.userId)];
            case 1:
                profile = _a.sent();
                res.status(httpStatus.OK).send({ message: 'Profile update succesfully', data: {} });
                return [2 /*return*/];
        }
    });
}); });
var leaveGroup = catchAsync(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var group_id, mergedBody;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                group_id = req.query.group_id;
                mergedBody = {
                    group_id: group_id,
                    modification_date: req.currentDate
                };
                return [4 /*yield*/, isGroupMember(req.userId, group_id)];
            case 1:
                if (!!!(_a.sent())) {
                    res.status(httpStatus.FORBIDDEN).send({ message: 'User is not part of this group' });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, userService.leaveGroup(mergedBody, req.userId)];
            case 2:
                _a.sent();
                res.status(httpStatus.OK).send({ message: 'Leave group succesfully', data: {} });
                return [2 /*return*/];
        }
    });
}); });
var deleteGroup = catchAsync(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var group_id, mergedBody, profile;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                group_id = req.query.group_id;
                mergedBody = {
                    group_id: group_id,
                    modification_date: req.currentDate
                };
                return [4 /*yield*/, userService.deleteGroup(mergedBody, req.userId)];
            case 1:
                profile = _a.sent();
                res.status(httpStatus.OK).send({ message: 'Delete succesfully', data: {} });
                return [2 /*return*/];
        }
    });
}); });
var removeFriend = catchAsync(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user_id, mergedBody, profile;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user_id = req.query.user_id;
                mergedBody = {
                    user_id: user_id,
                    modification_date: req.currentDate
                };
                return [4 /*yield*/, userService.removeFriend(mergedBody, req.userId)];
            case 1:
                profile = _a.sent();
                res.status(httpStatus.OK).send({ message: 'Delete succesfully', data: {} });
                return [2 /*return*/];
        }
    });
}); });
var takePlan = catchAsync(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var mergedBody;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                mergedBody = __assign(__assign({}, req.body), { modification_date: req.currentDate, plan_selected_date: req.currentDate });
                return [4 /*yield*/, userService.takePlan(mergedBody, req.userId)];
            case 1:
                _a.sent();
                res.status(httpStatus.OK).send({ message: 'Plan update succesfully', data: {} });
                return [2 /*return*/];
        }
    });
}); });
var getActivity = catchAsync(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var activity;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, activityService.getActivity(req.userId)];
            case 1:
                activity = _a.sent();
                res.status(httpStatus.OK).send({ message: 'Data Loading', data: { activity: activity } });
                return [2 /*return*/];
        }
    });
}); });
var getTransactions = catchAsync(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var transactions;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, userService.getTransactions(req.userId)];
            case 1:
                transactions = _a.sent();
                res.status(httpStatus.OK).send({ message: 'Transactions Fetched', data: { transactions: transactions } });
                return [2 /*return*/];
        }
    });
}); });
var getCommonGroups = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, currentUserId, commonGroups, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('GET common-groups  route was called');
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                userId = req.params.userId;
                currentUserId = req.userId;
                return [4 /*yield*/, findCommonGroups(currentUserId, userId)];
            case 2:
                commonGroups = _a.sent();
                res.status(httpStatus.OK).json(commonGroups);
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.log(req.userId);
                next(error_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
var getGroupWallet = catchAsync(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var groupId, groupWallet;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                groupId = req.params.groupId;
                return [4 /*yield*/, getGroupWalletByGroupId(groupId)];
            case 1:
                groupWallet = _a.sent();
                res.status(httpStatus.OK).send({ message: 'Group wallet fetched successfully', data: { groupWallet: groupWallet } });
                return [2 /*return*/];
        }
    });
}); });
var reportUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, reportedUserId, reportedUserName, reportMessage, newReport, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                console.log('Report User API called');
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                _a = req.body, reportedUserId = _a.reportedUserId, reportedUserName = _a.reportedUserName, reportMessage = _a.reportMessage;
                if (!reportedUserId || !reportedUserName || !reportMessage) {
                    return [2 /*return*/, res.status(400).json({ message: 'All fields are required' })];
                }
                newReport = new ReportedUser({
                    reportedUserId: reportedUserId,
                    reportedUserName: reportedUserName,
                    reportMessage: reportMessage
                });
                return [4 /*yield*/, newReport.save()];
            case 2:
                _b.sent();
                res.status(201).json({ message: 'User reported successfully' });
                return [3 /*break*/, 4];
            case 3:
                error_2 = _b.sent();
                console.error(error_2);
                res.status(500).json({ message: 'Server error' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
module.exports = {
    addFriends: addFriends,
    getFriends: getFriends,
    createGroups: createGroups,
    getMembersByGroupId: getMembersByGroupId,
    getMyGroups: getMyGroups,
    setPasscode: setPasscode,
    getAllTimezones: getAllTimezones,
    uploadFile: uploadFile,
    editProfile: editProfile,
    leaveGroup: leaveGroup,
    deleteGroup: deleteGroup,
    removeFriend: removeFriend,
    takePlan: takePlan,
    getActivity: getActivity,
    getUserDetails: getUserDetails,
    groupSettings: groupSettings,
    getTransactions: getTransactions,
    getCommonGroups: getCommonGroups,
    getGroupWallet: getGroupWallet,
    reportUser: reportUser,
    uploadUserProfilePicture: uploadUserProfilePicture
};
//# sourceMappingURL=users.controller.js.map