import { paymentService, userService } from '../services';
const httpStatus = require('http-status');
const catchAsync = require('./../utills/catchAsync');

const paymentInitated = catchAsync(async (req, res) => {
    console.log('controller user ID', req.userId);
    const mergedBody = {
        ...req.body,
        userId: req.userId,
        currentDate: req.currentDate
    };
    const data = await paymentService.paymentInitated(mergedBody);
    res.status(httpStatus.OK).send({ message: 'Payment succesfully', data });
});

const payoutInitated = catchAsync(async (req, res) => {
    const mergedBody = {
        ...req.body,
        userId: req.userId,
        currentDate: req.currentDate
    };
    const data = await paymentService.payoutInitated(mergedBody);
    res.status(httpStatus.OK).send({ message: 'Payout successfull', data });
});

const refundInitiated = catchAsync(async (req, res) => {
    const mergedBody = {
        ...req.body,
        userId: req.userId,
        currentDate: req.currentDate
    };
    const data = await paymentService.initiateRefund(mergedBody);
    res.status(httpStatus.OK).send({ message: 'Refund succesfully', data: { data } });
});

const addToWallet = catchAsync(async (req, res) => {
    const mergedBody = {
        ...req.body,
        userId: req.userId,
        currentDate: req.currentDate
    };
    const data = await paymentService.addToWallet(mergedBody);
    res.status(httpStatus.OK).send({ message: 'Added to wallet', data });
});

const makePayment = catchAsync(async (req, res) => {
    const mergedBody = {
        ...req.body,
        userId: req.userId,
        currentDate: req.currentDate
    };
    const group_details = await userService.getGroupDetails(mergedBody.groupId);
    if(group_details.owner_only_payment && !req.userId.id.equals(group_details.group_owner.id)){
        res.status(httpStatus.UNAUTHORIZED).send({ message: 'Not Authorised to make payment, Contact group admin', data: {} });
        return
    }
    const data = await paymentService.makePayment(mergedBody);
    res.status(httpStatus.OK).send({ message: 'Payment successful', data });
})

const payToPalspay = catchAsync(async (req, res) => {
    const mergedBody = {
        ...req.body,
        userId: req.userId,
        currentDate: req.currentDate
    };
    const data = await paymentService.payToPalspay(mergedBody);
    res.status(httpStatus.OK).send({ message: 'Added to wallet', data });
});
// const checkStatus = catchAsync(async (req, res) => {
//     const txnId = req.query.txnId;
//     const mergedBody = {
//         txnId,
//         userId: req.userId,
//         currentDate: req.currentDate
//     };
//     const status = await paymentService.checkStatus(mergedBody);
//     res.status(httpStatus.OK).send({ message: status.message ,data: {} });
// });


// module.exports = {
//     paymentInitated,
//     payoutInitated,
//     refundInitiated
//     // checkStatus
// };

export { paymentInitated, payoutInitated, refundInitiated, addToWallet, makePayment, payToPalspay }