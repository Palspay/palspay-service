const httpStatus = require('http-status');
const catchAsync = require('./../utills/catchAsync');
const { adminService } = require('./../services');

const createPlans = catchAsync(async (req, res) => {
    const mergedBody = {
        ...req.body,
        userId: req.userId,
        currentDate: req.currentDate
    };
    await adminService.createPlans(mergedBody);
    res.status(httpStatus.CREATED).send({ message: 'Plan Add succesfully',data:{} });
});


module.exports = {
    createPlans
};