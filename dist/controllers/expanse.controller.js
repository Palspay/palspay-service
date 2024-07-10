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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var httpStatus = require('http-status');
var catchAsync = require('../utills/catchAsync');
var userExpanse = require('../services').userExpanse;
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var addExpanse = catchAsync(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var mergedBody, expanse_id;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                mergedBody = __assign(__assign({}, req.body), { userId: req.userId, currentDate: req.currentDate });
                return [4 /*yield*/, userExpanse.createExpanse(mergedBody)];
            case 1:
                expanse_id = _a.sent();
                res.status(httpStatus.CREATED).send({ message: 'Expanses add succesfully', data: { expanse_id: expanse_id._id } });
                return [2 /*return*/];
        }
    });
}); });
var updateExpanse = catchAsync(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var expanseId, mergedBody, expanse_id;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                expanseId = req.params.id;
                mergedBody = __assign(__assign({}, req.body), { expanseId: expanseId, userId: req.userId, currentDate: req.currentDate });
                return [4 /*yield*/, userExpanse.updateExpanse(mergedBody)];
            case 1:
                expanse_id = _a.sent();
                res.status(httpStatus.CREATED).send({ message: 'Expanses updated succesfully', data: { expanse_id: expanse_id._id } });
                return [2 /*return*/];
        }
    });
}); });
var deleteExpanse = catchAsync(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var expanseId, mergedBody, expanseData;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                expanseId = req.params.id;
                mergedBody = __assign(__assign({}, req.body), { expanseId: expanseId, userId: req.userId, currentDate: req.currentDate });
                return [4 /*yield*/, userExpanse.deleteExpanse(mergedBody)];
            case 1:
                expanseData = _a.sent();
                res.status(httpStatus.OK).send({ message: 'Delete expanse succesfully', data: { expanseData: expanseData } });
                return [2 /*return*/];
        }
    });
}); });
var getExpanse = catchAsync(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var mergedBody, data, total_lent, total_borrowed, owe_arr, owes_arr, _a, _b, _c, item, _d, borrowed, lent, _e, _f, _g, payer, e_1_1, e_2_1, owe_sums, sums_1, result, owe_result;
    var _h, e_2, _j, _k, _l, e_1, _m, _o;
    return __generator(this, function (_p) {
        switch (_p.label) {
            case 0:
                mergedBody = __assign(__assign({}, req.body), { userId: req.userId, currentDate: req.currentDate });
                return [4 /*yield*/, userExpanse.getGroupExpanse(mergedBody)];
            case 1:
                data = _p.sent();
                if (!data) return [3 /*break*/, 26];
                total_lent = 0, total_borrowed = 0, owe_arr = [], owes_arr = [];
                _p.label = 2;
            case 2:
                _p.trys.push([2, 19, 20, 25]);
                _a = true, _b = __asyncValues(data.expanseList);
                _p.label = 3;
            case 3: return [4 /*yield*/, _b.next()];
            case 4:
                if (!(_c = _p.sent(), _h = _c.done, !_h)) return [3 /*break*/, 18];
                _k = _c.value;
                _a = false;
                item = _k;
                mergedBody.id = item._id;
                _d = item;
                return [4 /*yield*/, userExpanse.fetchExpanse(mergedBody)];
            case 5:
                _d.expanseData = _p.sent();
                total_lent += parseFloat(item.expanseData.you_lent);
                total_borrowed += parseFloat(item.expanseData.you_borrowed);
                borrowed = parseFloat(item.expanseData.you_borrowed);
                lent = parseFloat(item.expanseData.you_lent);
                if (borrowed > 0) {
                    owe_arr.push({ from: "You", amount: borrowed, to: item.addPayer[0].name, to_id: item.addPayer[0].from.toString() });
                }
                if (!(lent > 0)) return [3 /*break*/, 17];
                _p.label = 6;
            case 6:
                _p.trys.push([6, 11, 12, 17]);
                _e = true, _f = (e_1 = void 0, __asyncValues(item.expanseData.expanse_details));
                _p.label = 7;
            case 7: return [4 /*yield*/, _f.next()];
            case 8:
                if (!(_g = _p.sent(), _l = _g.done, !_l)) return [3 /*break*/, 10];
                _o = _g.value;
                _e = false;
                payer = _o;
                if (payer.type == "owes")
                    owes_arr.push({ from: payer.name, amount: payer.amount, to: "You", from_id: payer.memberId.toString() });
                _p.label = 9;
            case 9:
                _e = true;
                return [3 /*break*/, 7];
            case 10: return [3 /*break*/, 17];
            case 11:
                e_1_1 = _p.sent();
                e_1 = { error: e_1_1 };
                return [3 /*break*/, 17];
            case 12:
                _p.trys.push([12, , 15, 16]);
                if (!(!_e && !_l && (_m = _f.return))) return [3 /*break*/, 14];
                return [4 /*yield*/, _m.call(_f)];
            case 13:
                _p.sent();
                _p.label = 14;
            case 14: return [3 /*break*/, 16];
            case 15:
                if (e_1) throw e_1.error;
                return [7 /*endfinally*/];
            case 16: return [7 /*endfinally*/];
            case 17:
                _a = true;
                return [3 /*break*/, 3];
            case 18: return [3 /*break*/, 25];
            case 19:
                e_2_1 = _p.sent();
                e_2 = { error: e_2_1 };
                return [3 /*break*/, 25];
            case 20:
                _p.trys.push([20, , 23, 24]);
                if (!(!_a && !_h && (_j = _b.return))) return [3 /*break*/, 22];
                return [4 /*yield*/, _j.call(_b)];
            case 21:
                _p.sent();
                _p.label = 22;
            case 22: return [3 /*break*/, 24];
            case 23:
                if (e_2) throw e_2.error;
                return [7 /*endfinally*/];
            case 24: return [7 /*endfinally*/];
            case 25:
                data.overall = total_lent - total_borrowed;
                owe_sums = {};
                sums_1 = {};
                // Iterate through the owes_arr
                owes_arr.forEach(function (item) {
                    var key = "".concat(item.from_id, "_").concat(item.from);
                    sums_1[key] = (sums_1[key] || 0) + parseInt(item.amount, 10);
                });
                result = Object.keys(sums_1).map(function (key) {
                    var _a = key.split('_'), from_id = _a[0], from = _a[1];
                    return { from_id: from_id, from: from, amount: sums_1[key], to: "You" };
                });
                owe_arr.forEach(function (item) {
                    var key = "".concat(item.to_id, "_").concat(item.to);
                    // @ts-ignore
                    sums_1[key] = (sums_1[key] || 0) + parseInt(item.amount, 10);
                });
                owe_result = Object.keys(sums_1).map(function (key) {
                    var _a = key.split('_'), to_id = _a[0], to = _a[1];
                    return { to_id: to_id, from: "You", amount: sums_1[key], to: to };
                });
                data.owe_arr = owe_result;
                data.owes_arr = result;
                // if (overall > 0) { data.owed_overall = overall } else { data.owe_overall = overall }
                res.status(httpStatus.OK).send({ message: 'Expanse Load succesfully', data: data });
                return [3 /*break*/, 27];
            case 26:
                res.status(httpStatus.OK).send({ message: 'Expanse Load succesfully', data: {} });
                _p.label = 27;
            case 27: return [2 /*return*/];
        }
    });
}); });
var fetchExpanse = catchAsync(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var mergedBody, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                mergedBody = __assign(__assign({}, req.body), { id: req.params.id, userId: req.userId, currentDate: req.currentDate });
                return [4 /*yield*/, userExpanse.fetchExpanse(mergedBody)];
            case 1:
                data = _a.sent();
                if (data) {
                    res.status(httpStatus.OK).send({ message: 'Fetch expanse load succesfully', data: data });
                }
                else {
                    res.status(httpStatus.OK).send({ message: 'Expanse Load succesfully', data: {} });
                }
                return [2 /*return*/];
        }
    });
}); });
var individualExpanse = catchAsync(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var friendId, mergedBody, data, sums_2, total_lent, total_borrowed, owe_arr, owes_arr, expanse, groupDetails, _a, data_1, data_1_1, item, borrowed, lent, _b, _c, _d, payer, e_3_1, e_4_1, result, owe_result;
    var _e, e_4, _f, _g, _h, e_3, _j, _k;
    return __generator(this, function (_l) {
        switch (_l.label) {
            case 0:
                friendId = (req.query.friendId) ? new ObjectId(req.query.friendId) : null;
                mergedBody = __assign(__assign({}, req.body), { userId: req.userId, friendId: friendId, currentDate: req.currentDate });
                return [4 /*yield*/, userExpanse.individualExpanse(mergedBody)];
            case 1:
                data = _l.sent();
                if (!(data.length > 0)) return [3 /*break*/, 26];
                sums_2 = {};
                total_lent = 0, total_borrowed = 0, owe_arr = [], owes_arr = [], expanse = {}, groupDetails = {};
                _l.label = 2;
            case 2:
                _l.trys.push([2, 19, 20, 25]);
                _a = true, data_1 = __asyncValues(data);
                _l.label = 3;
            case 3: return [4 /*yield*/, data_1.next()];
            case 4:
                if (!(data_1_1 = _l.sent(), _e = data_1_1.done, !_e)) return [3 /*break*/, 18];
                _g = data_1_1.value;
                _a = false;
                item = _g;
                mergedBody.expanseId = item._id;
                // item.expanseData = await userExpanse.fetchExpanse(mergedBody);
                total_lent += parseFloat(item.you_lent);
                total_borrowed += parseFloat(item.you_borrowed);
                borrowed = parseFloat(item.you_borrowed);
                lent = parseFloat(item.you_lent);
                return [4 /*yield*/, userExpanse.getGroupByUser(mergedBody)];
            case 5:
                groupDetails = _l.sent(); //group details for linked user
                if (borrowed > 0) {
                    owe_arr.push({ from: "You", amount: borrowed, to: item.addPayer[0].name, to_id: item.addPayer[0].from.toString() });
                }
                if (!(lent > 0)) return [3 /*break*/, 17];
                _l.label = 6;
            case 6:
                _l.trys.push([6, 11, 12, 17]);
                _b = true, _c = (e_3 = void 0, __asyncValues(item.expanse_details));
                _l.label = 7;
            case 7: return [4 /*yield*/, _c.next()];
            case 8:
                if (!(_d = _l.sent(), _h = _d.done, !_h)) return [3 /*break*/, 10];
                _k = _d.value;
                _b = false;
                payer = _k;
                if (payer.type == "owes")
                    owes_arr.push({ from: payer.name, amount: payer.amount, to: "You", from_id: payer.memberId.toString() });
                _l.label = 9;
            case 9:
                _b = true;
                return [3 /*break*/, 7];
            case 10: return [3 /*break*/, 17];
            case 11:
                e_3_1 = _l.sent();
                e_3 = { error: e_3_1 };
                return [3 /*break*/, 17];
            case 12:
                _l.trys.push([12, , 15, 16]);
                if (!(!_b && !_h && (_j = _c.return))) return [3 /*break*/, 14];
                return [4 /*yield*/, _j.call(_c)];
            case 13:
                _l.sent();
                _l.label = 14;
            case 14: return [3 /*break*/, 16];
            case 15:
                if (e_3) throw e_3.error;
                return [7 /*endfinally*/];
            case 16: return [7 /*endfinally*/];
            case 17:
                _a = true;
                return [3 /*break*/, 3];
            case 18: return [3 /*break*/, 25];
            case 19:
                e_4_1 = _l.sent();
                e_4 = { error: e_4_1 };
                return [3 /*break*/, 25];
            case 20:
                _l.trys.push([20, , 23, 24]);
                if (!(!_a && !_e && (_f = data_1.return))) return [3 /*break*/, 22];
                return [4 /*yield*/, _f.call(data_1)];
            case 21:
                _l.sent();
                _l.label = 22;
            case 22: return [3 /*break*/, 24];
            case 23:
                if (e_4) throw e_4.error;
                return [7 /*endfinally*/];
            case 24: return [7 /*endfinally*/];
            case 25:
                expanse.overall = total_lent - total_borrowed;
                expanse.total_lent = total_lent;
                expanse.total_borrowed = total_borrowed;
                if (owes_arr.length > 0) {
                    owes_arr.forEach(function (item) {
                        var key = "".concat(item.from_id, "_").concat(item.from);
                        sums_2[key] = (sums_2[key] || 0) + parseInt(item.amount, 10);
                    });
                    result = Object.keys(sums_2).map(function (key) {
                        var _a = key.split('_'), from_id = _a[0], from = _a[1];
                        return { from_id: from_id, from: from, amount: sums_2[key], to: "You" };
                    });
                    expanse.owes_arr = result;
                }
                else {
                    expanse.owes_arr = [];
                }
                if (owe_arr.length > 0) {
                    owe_arr.forEach(function (item) {
                        var key = "".concat(item.to_id, "_").concat(item.to);
                        // @ts-ignore
                        sums_2[key] = (sums_2[key] || 0) + parseInt(item.amount, 10);
                    });
                    owe_result = Object.keys(sums_2).map(function (key) {
                        var _a = key.split('_'), to_id = _a[0], to = _a[1];
                        return { to_id: to_id, from: "You", amount: sums_2[key], to: to };
                    });
                    expanse.owe_arr = owe_result;
                }
                else {
                    expanse.owe_arr = [];
                }
                res.status(httpStatus.OK).send({ message: 'Expanse list load succesfully', data: data, expanse: expanse, groupDetails: groupDetails });
                return [3 /*break*/, 27];
            case 26:
                res.status(httpStatus.OK).send({ message: 'Expanse list load succesfully', data: [] });
                _l.label = 27;
            case 27: return [2 /*return*/];
        }
    });
}); });
module.exports = {
    addExpanse: addExpanse,
    updateExpanse: updateExpanse,
    getExpanse: getExpanse,
    fetchExpanse: fetchExpanse,
    deleteExpanse: deleteExpanse,
    individualExpanse: individualExpanse,
};
//# sourceMappingURL=expanse.controller.js.map