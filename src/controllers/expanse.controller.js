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

const updateExpanse = catchAsync(async(req, res) => {
    const expanseId = req.params.id;
    const mergedBody = {
        ...req.body,
        expanseId,
        userId: req.userId,
        currentDate: req.currentDate
    };
    const expanse_id = await userExpanse.updateExpanse(mergedBody);
    res.status(httpStatus.CREATED).send({ message: 'Expanses updated succesfully', data: { expanse_id: expanse_id._id } });
});

const deleteExpanse = catchAsync(async(req, res) => {
    const expanseId = req.params.id;
    const mergedBody = {
        ...req.body,
        expanseId,
        userId: req.userId,
        currentDate: req.currentDate
    };
    const expanseData = await userExpanse.deleteExpanse(mergedBody);
    res.status(httpStatus.OK).send({ message: 'Delete expanse succesfully', data: { expanseData } });
});

const getExpanse = catchAsync(async(req, res) => {
    const mergedBody = {
        ...req.body,
        userId: req.userId,
        currentDate: req.currentDate
    };
    const data = await userExpanse.getGroupExpanse(mergedBody);
    // for await (let item of data.expanseList) {
    //     if (item._id.toString() == "653b49d85f5cbada14581269") {
    //         mergedBody.expanseId = item._id;
    //         item.expanseData = await userExpanse.fetchExpanse(mergedBody);
    //     }
    // }
    if (data) {
        res.status(httpStatus.OK).send({ message: 'Expanse Load succesfully', data });
    } else {
        res.status(httpStatus.OK).send({ message: 'Expanse Load succesfully', data: {} });
    }
});
const fetchExpanse = catchAsync(async(req, res) => {
    const mergedBody = {
        ...req.body,
        userId: req.userId,
        currentDate: req.currentDate
    };
    const data = await userExpanse.fetchExpanse(mergedBody);
    if (data) {
        res.status(httpStatus.OK).send({ message: 'Fetch expanse load succesfully', data });
    } else {
        res.status(httpStatus.OK).send({ message: 'Expanse Load succesfully', data: {} });
    }
});
const individualExpanse = catchAsync(async(req, res) => {
    const mergedBody = {
        ...req.body,
        userId: req.userId,
        currentDate: req.currentDate
    };
    const data = await userExpanse.individualExpanse(mergedBody);
    if (data.length > 0) {
        res.status(httpStatus.OK).send({ message: 'Expanse list load succesfully', data });
    } else {
        res.status(httpStatus.OK).send({ message: 'Expanse list load succesfully', data: [] });
    }
});
module.exports = {
    addExpanse,
    updateExpanse,
    getExpanse,
    fetchExpanse,
    deleteExpanse,
    individualExpanse,
};