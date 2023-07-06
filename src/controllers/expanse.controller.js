const httpStatus = require('http-status');
const catchAsync = require('../utills/catchAsync');
const { userExpanse } = require('../services');

const addExpanse = catchAsync(async(req, res) => {
    const mergedBody = {
        ...req.body,
        userId: req.userId,
        currentDate: req.currentDate
    };

    const expanse_id = await userExpanse.createExpanse(mergedBody);
    res.status(httpStatus.CREATED).send({ message: 'Expanses add succesfully', data: { expanse_id: expanse_id._id } });
});

const getExpanse = catchAsync(async(req, res) => {
    const mergedBody = {
        ...req.body,
        userId: req.userId,
        currentDate: req.currentDate
    };
    const expanseData = await userExpanse.getGroupExpanse(mergedBody);
    res.status(httpStatus.OK).send({ message: 'Expanse Load succesfully', data: { expanseData } });
});
module.exports = {
    addExpanse,
    getExpanse
};