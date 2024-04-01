const httpStatus = require('http-status');
const catchAsync = require('./../utills/catchAsync');
const { paymentService } = require('./../services');

const paymentInitated = catchAsync(async (req, res) => {
    const mergedBody = {
        ...req.body,
        userId: req.userId,
        currentDate: req.currentDate
    };
    const data=await paymentService.paymentInitated(mergedBody);
    res.status(httpStatus.CREATED).send({ message: 'Payment succesfully',data:{data} });
});



const checkStatus = catchAsync(async (req, res) => {
    const txnId = req.query.txnId;
    const mergedBody = {
        txnId,
        userId: req.userId,
        currentDate: req.currentDate
    };
    const status = await paymentService.checkStatus(mergedBody);
    res.status(httpStatus.OK).send({ message: status.message ,data: {} });
});


module.exports = {
    paymentInitated,
    checkStatus
};