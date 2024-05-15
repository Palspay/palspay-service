import httpStatus from 'http-status';
import catchAsync from './../utills/catchAsync.js';
import { adminService } from './../services/index.js';

const createPlans = catchAsync(async (req, res) => {
    const mergedBody = {
        ...req.body,
        userId: req.userId,
        currentDate: req.currentDate
    };
    await adminService.createPlans(mergedBody);
    res.status(httpStatus.CREATED).send({ message: 'Plan Add succesfully',data:{} });
});


export default {
    createPlans
};