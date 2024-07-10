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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makePayment = exports.addToWallet = exports.checkStatus = exports.initiateRefund = exports.payoutInitated = exports.paymentInitated = void 0;
var http_status_1 = __importDefault(require("http-status"));
var ApiError_1 = __importDefault(require("../utills/ApiError"));
var mongoose_1 = __importDefault(require("mongoose"));
var transaction_model_1 = require("../models/transaction.model");
var crypto_1 = __importDefault(require("crypto"));
var axios_1 = __importDefault(require("axios"));
var razorpay_1 = __importDefault(require("../utills/razorpay"));
var group_wallet_modal_1 = __importDefault(require("../models/group-wallet.modal"));
var models_1 = require("../models");
var config_1 = require("../config/config");
var validatePaymentVerification = require("razorpay/dist/utils/razorpay-utils").validatePaymentVerification;
var paymentInitated = function (paymentData) { return __awaiter(void 0, void 0, void 0, function () {
    var amount, paidTo, userId, groupId, order, orderData, data, error_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                amount = paymentData.amount, paidTo = paymentData.paidTo, userId = paymentData.userId, groupId = paymentData.groupId;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                return [4 /*yield*/, razorpay_1.default.orders.create({
                        amount: amount,
                        currency: "INR",
                        partial_payment: false,
                        notes: {
                            groupId: groupId,
                        },
                    })];
            case 2:
                order = _b.sent();
                orderData = {
                    userId: userId,
                    paidTo: paidTo,
                    amount: amount,
                    groupId: groupId,
                    status: transaction_model_1.PaymentStatus.PAYMENT_INITIATED,
                    paymentData: order,
                };
                return [4 /*yield*/, transaction_model_1.Transaction.create(orderData)];
            case 3:
                data = _b.sent();
                return [2 /*return*/, {
                        // @ts-ignore
                        orderId: (_a = data === null || data === void 0 ? void 0 : data.paymentData) === null || _a === void 0 ? void 0 : _a.id,
                        transactionId: data._id,
                    }];
            case 4:
                error_1 = _b.sent();
                console.log(error_1);
                throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Internal Server Error");
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.paymentInitated = paymentInitated;
var payoutInitated = function (payoutData) { return __awaiter(void 0, void 0, void 0, function () {
    var paymentId, signature, transactionId, data, session, userData, razorpayPayoutData, payoutResponse, paymentInfo, error_2, refundData;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                paymentId = payoutData.paymentId, signature = payoutData.signature, transactionId = payoutData.transactionId;
                return [4 /*yield*/, transaction_model_1.Transaction.findOne({
                        _id: transactionId
                    })];
            case 1:
                data = _b.sent();
                return [4 /*yield*/, mongoose_1.default.startSession()];
            case 2:
                session = _b.sent();
                session.startTransaction();
                _b.label = 3;
            case 3:
                _b.trys.push([3, 11, , 14]);
                return [4 /*yield*/, validatePayment(data, paymentId, signature)];
            case 4:
                _b.sent();
                return [4 /*yield*/, models_1.User.findOne({ _id: data.paidTo })];
            case 5:
                userData = _b.sent();
                if (!userData) {
                    throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "user not found");
                }
                if (!userData.vpa || userData.vpa === "") {
                    throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "VPA not set for receiver");
                }
                razorpayPayoutData = {
                    amount: data.amount,
                    vpa: userData.vpa,
                    name: userData.name,
                    userId: userData._id,
                    email: userData.email,
                    mobile: userData.mobile,
                    transactionId: data._id
                };
                return [4 /*yield*/, razorpayPayout(razorpayPayoutData)];
            case 6:
                payoutResponse = _b.sent();
                if (!(payoutResponse.status === 200)) return [3 /*break*/, 9];
                paymentInfo = {
                    status: transaction_model_1.PaymentStatus.PAYMENT_COMPLETED,
                };
                return [4 /*yield*/, transaction_model_1.Transaction.findOneAndUpdate({ _id: transactionId }, { $set: __assign({}, paymentInfo) }).lean()];
            case 7:
                _b.sent();
                return [4 /*yield*/, session.commitTransaction()];
            case 8:
                _b.sent();
                session.endSession();
                return [2 /*return*/, { paymentStatus: (_a = payoutResponse === null || payoutResponse === void 0 ? void 0 : payoutResponse.data) === null || _a === void 0 ? void 0 : _a.status }];
            case 9: throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Internal Server Error, Razorpay payout failed.");
            case 10: return [3 /*break*/, 14];
            case 11:
                error_2 = _b.sent();
                refundData = {
                    paymentId: paymentId,
                    amount: data.amount,
                    reason: "Payout failure",
                };
                return [4 /*yield*/, initiateRefund(refundData)];
            case 12:
                _b.sent();
                return [4 /*yield*/, session.commitTransaction()];
            case 13:
                _b.sent();
                session.endSession();
                throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Internal Server Error, Refund initiated.");
            case 14: return [2 /*return*/];
        }
    });
}); };
exports.payoutInitated = payoutInitated;
var initiateRefund = function (refundData) { return __awaiter(void 0, void 0, void 0, function () {
    var paymentId, paymentInfo, refundResponse, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                paymentId = refundData.paymentId;
                paymentInfo = {
                    status: transaction_model_1.PaymentStatus.REFUND_INITITATED,
                };
                return [4 /*yield*/, razorpay_1.default.payments.refund(paymentId, {
                        amount: refundData.amount,
                        speed: "normal",
                        notes: {
                            reason: refundData.reason
                        },
                    })];
            case 1:
                refundResponse = _a.sent();
                if (refundResponse.status !== 'processed') {
                    paymentInfo = {
                        status: transaction_model_1.PaymentStatus.REFUND_FAILED
                    };
                }
                return [4 /*yield*/, transaction_model_1.Transaction.findOneAndUpdate({ _id: new mongoose_1.default.Types.ObjectId(paymentId) }, { $set: __assign({}, paymentInfo) }).lean()];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Internal Server Error, Error in refund, contact admin.");
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.initiateRefund = initiateRefund;
var addToWallet = function (paymentData) { return __awaiter(void 0, void 0, void 0, function () {
    var paymentId, signature, transactionId, transaction, session, paymentInfo, amount, wallet, error_4, refundData;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                paymentId = paymentData.paymentId, signature = paymentData.signature, transactionId = paymentData.transactionId;
                return [4 /*yield*/, mongoose_1.default.startSession()];
            case 1:
                session = _a.sent();
                session.startTransaction();
                _a.label = 2;
            case 2:
                _a.trys.push([2, 6, , 10]);
                paymentInfo = {
                    status: transaction_model_1.PaymentStatus.PAYMENT_COMPLETED
                };
                return [4 /*yield*/, transaction_model_1.Transaction.findOneAndUpdate({ _id: transactionId }, { $set: __assign({}, paymentInfo) }).lean()];
            case 3:
                transaction = _a.sent();
                return [4 /*yield*/, validatePayment(transaction, paymentId, signature)];
            case 4:
                _a.sent();
                amount = parseFloat(transaction.amount);
                return [4 /*yield*/, group_wallet_modal_1.default.findOneAndUpdate({ group_id: transaction.groupId }, { $push: { transactions: { type: 'DEPOSIT', amount: amount, userId: transaction.userId } } }, { new: true })];
            case 5:
                wallet = _a.sent();
                return [2 /*return*/, wallet];
            case 6:
                error_4 = _a.sent();
                if (!transaction) return [3 /*break*/, 9];
                refundData = {
                    paymentId: paymentId,
                    amount: transaction.amount,
                    reason: "Error in adding to wallet",
                };
                return [4 /*yield*/, initiateRefund(refundData)];
            case 7:
                _a.sent();
                return [4 /*yield*/, session.commitTransaction()];
            case 8:
                _a.sent();
                session.endSession();
                _a.label = 9;
            case 9: throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, error_4);
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.addToWallet = addToWallet;
var makePayment = function (paymentData) { return __awaiter(void 0, void 0, void 0, function () {
    var transactionInfo, wallet, session, razorpayPayoutData, payoutResponse, error_5;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                transactionInfo = {
                    type: "PAYMENT",
                    amount: paymentData.amount,
                    vendorId: paymentData.vpa
                };
                return [4 /*yield*/, group_wallet_modal_1.default.findOne({
                        group_id: paymentData.groupId
                    })];
            case 1:
                wallet = _b.sent();
                if (wallet.balance < paymentData.amount) {
                    throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Insufficient Balance");
                }
                return [4 /*yield*/, mongoose_1.default.startSession()];
            case 2:
                session = _b.sent();
                session.startTransaction();
                _b.label = 3;
            case 3:
                _b.trys.push([3, 8, , 10]);
                return [4 /*yield*/, group_wallet_modal_1.default.findOneAndUpdate({ group_id: paymentData.groupId }, { $push: { transactions: transactionInfo } }, { new: true })];
            case 4:
                _b.sent();
                razorpayPayoutData = {
                    amount: paymentData.amount,
                    vpa: paymentData.vpa,
                    name: paymentData.name,
                    userId: paymentData.vpa,
                    email: paymentData.email,
                    mobile: paymentData.mobile,
                    transactionId: ""
                };
                return [4 /*yield*/, razorpayPayout(razorpayPayoutData)];
            case 5:
                payoutResponse = _b.sent();
                if (!(payoutResponse.status === 200)) return [3 /*break*/, 7];
                return [4 /*yield*/, session.commitTransaction()];
            case 6:
                _b.sent();
                session.endSession();
                return [2 /*return*/, { paymentStatus: (_a = payoutResponse === null || payoutResponse === void 0 ? void 0 : payoutResponse.data) === null || _a === void 0 ? void 0 : _a.status }];
            case 7: return [3 /*break*/, 10];
            case 8:
                error_5 = _b.sent();
                return [4 /*yield*/, session.abortTransaction()];
            case 9:
                _b.sent();
                session.endSession();
                throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Internal Server Error, Payment failed.");
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.makePayment = makePayment;
var checkStatus = function (body) { return __awaiter(void 0, void 0, void 0, function () {
    var merchantTransactionId, merchantId, keyIndex, string, sha256, checksum, options, status, paymentInfo, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                merchantTransactionId = body.txnId;
                merchantId = process.env.MERCHANT_ID;
                keyIndex = 1;
                string = "/pg/v1/status/".concat(merchantId, "/").concat(merchantTransactionId) +
                    process.env.SALT_KEY;
                sha256 = crypto_1.default.createHash("sha256").update(string).digest("hex");
                checksum = sha256 + "###" + keyIndex;
                options = {
                    method: "GET",
                    url: "https://api-preprod.phonepe.com/apis/hermes/pg/v1/status/".concat(merchantId, "/").concat(merchantTransactionId),
                    headers: {
                        accept: "application/json",
                        "Content-Type": "application/json",
                        "X-VERIFY": checksum,
                        "X-MERCHANT-ID": "".concat(merchantId),
                    },
                };
                return [4 /*yield*/, axios_1.default.request(options)];
            case 1:
                status = _a.sent();
                _a.label = 2;
            case 2:
                _a.trys.push([2, 6, , 7]);
                if (!status.status) return [3 /*break*/, 4];
                paymentInfo = {
                    paymentData: status.data.data.paymentInstrument,
                    status: status.data.success ? "Success" : "Failed",
                };
                return [4 /*yield*/, transaction_model_1.Transaction.findOneAndUpdate({ merchantTransactionId: status.data.data.merchantTransactionId }, { $set: paymentInfo }).lean()];
            case 3:
                _a.sent();
                return [2 /*return*/, { message: status.data.message }];
            case 4: return [2 /*return*/, { message: "Paymemt failed" }];
            case 5: return [3 /*break*/, 7];
            case 6:
                error_6 = _a.sent();
                throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Internal Server Error");
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.checkStatus = checkStatus;
function validatePayment(data, paymentId, signature) {
    return __awaiter(this, void 0, void 0, function () {
        var validPayment, order;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    validPayment = validatePaymentVerification(
                    // @ts-ignore
                    { order_id: (_a = data === null || data === void 0 ? void 0 : data.paymentData) === null || _a === void 0 ? void 0 : _a.id, payment_id: paymentId }, signature, process.env.RAZORPAY_KEY_SECRET);
                    if (!!validPayment) return [3 /*break*/, 2];
                    return [4 /*yield*/, razorpay_1.default.payments.refund(paymentId, {
                            amount: data.amount,
                            speed: "normal",
                            notes: {
                                reason: "Payout failure",
                            },
                        })];
                case 1:
                    order = _b.sent();
                    console.log(order);
                    throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Payment verification failed");
                case 2: return [2 /*return*/];
            }
        });
    });
}
function razorpayPayout(data) {
    return __awaiter(this, void 0, void 0, function () {
        var payoutRequest, options, response, error_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    payoutRequest = {
                        account_number: process.env.RAZORPAY_ACCOUNT_NUMBER,
                        amount: data.amount,
                        currency: "INR",
                        mode: "UPI",
                        purpose: "payout",
                        fund_account: {
                            account_type: "vpa",
                            vpa: {
                                address: data.vpa,
                            },
                            contact: {
                                name: data.name,
                                email: data.email,
                                contact: data.mobile,
                                type: "employee",
                                reference_id: data.userId,
                                // notes: {
                                //   notes_key_1: "Tea, Earl Grey, Hot",
                                //   notes_key_2: "Tea, Earl Grey… decaf.",
                                // },
                            },
                        },
                        queue_if_low_balance: true,
                        reference_id: data.transactionId,
                        narration: "PalsPay payment",
                        // notes: {
                        //   notes_key_1: "Beam me up Scotty",
                        //   notes_key_2: "Engage",
                        // },
                    };
                    options = {
                        method: "POST",
                        url: process.env.RAZORPAY_URL + "/v1/payouts",
                        auth: {
                            username: process.env.RAZORPAY_KEY_ID,
                            password: process.env.RAZORPAY_KEY_SECRET,
                        },
                        headers: {
                            accept: "application/json",
                            "Content-Type": "application/json",
                        },
                        data: __assign({}, payoutRequest),
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios_1.default.request(options)];
                case 2:
                    response = _a.sent();
                    return [2 /*return*/, response];
                case 3:
                    error_7 = _a.sent();
                    console.log(error_7);
                    throw error_7;
                case 4: return [2 /*return*/];
            }
        });
    });
}
//# sourceMappingURL=payment.service.js.map