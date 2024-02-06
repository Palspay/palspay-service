const httpStatus = require('http-status');
const catchAsync = require('../utills/catchAsync');
const { userExpanse } = require('../services');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

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

    let total_lent = 0,
        total_borrowed = 0,
        owe_arr = [],
        owes_arr = [];
    for await (let item of data.expanseList) {
        mergedBody.expanseId = item._id;
        item.expanseData = await userExpanse.fetchExpanse(mergedBody);
        total_lent += parseFloat(item.expanseData.you_lent);
        total_borrowed += parseFloat(item.expanseData.you_borrowed);
        let borrowed = parseFloat(item.expanseData.you_borrowed)
        let lent = parseFloat(item.expanseData.you_lent)

        if (borrowed > 0) {
            owe_arr.push({ from: "You", amount: borrowed, to: item.addPayer[0].name, to_id: item.addPayer[0].from.toString() })
        }
        if (lent > 0) {
            for await (let payer of item.expanseData.expanse_details) {
                if (payer.type == "owes")
                    owes_arr.push({ from: payer.name, amount: payer.amount, to: "You", from_id: payer.memberId.toString() })
            }
        }
    }
    if (data) {
        data.overall = total_lent - total_borrowed;
        const owe_sums = {};
        const sums = {};

        // Iterate through the owes_arr
        owes_arr.forEach(item => {
            const key = `${item.from_id}_${item.from}`;
            sums[key] = (sums[key] || 0) + parseInt(item.amount, 10);
        });

        const result = Object.keys(sums).map(key => {
            const [from_id, from] = key.split('_');
            return { from_id, from, amount: sums[key], to: "You" };
        });

        owe_arr.forEach(item => {
            const key = `${item.to_id}_${item.to}`;
            sums[key] = (sums[key] || 0) + parseInt(item.amount, 10);
        });

        const owe_result = Object.keys(sums).map(key => {
            const [to_id, to] = key.split('_');
            return { to_id, from: "You", amount: sums[key], to };
        });


        data.owe_arr = owe_result;

        data.owes_arr = result;
        // if (overall > 0) { data.owed_overall = overall } else { data.owe_overall = overall }
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

    let userId = (req.query.friendId) ? new ObjectId(req.query.friendId) : req.userId;
    const mergedBody = {
        ...req.body,
        userId: userId,
        currentDate: req.currentDate
    };
    const data = await userExpanse.individualExpanse(mergedBody);
    if (data.length > 0) {
        const sums = {};
        let total_lent = 0,
            total_borrowed = 0,
            owe_arr = [],
            owes_arr = [],
            expanse = {};
        for await (let item of data) {
            mergedBody.expanseId = item._id;
            item.expanseData = await userExpanse.fetchExpanse(mergedBody);
            total_lent += parseFloat(item.expanseData.you_lent);
            total_borrowed += parseFloat(item.expanseData.you_borrowed);
            let borrowed = parseFloat(item.expanseData.you_borrowed)
            let lent = parseFloat(item.expanseData.you_lent)
            mergedBody.check = "individual"; //group details for linked user
            expanse.groupDetails = await userExpanse.getGroupExpanse(mergedBody);

            if (borrowed > 0) {
                // console.log(item, "payer", borrowed);
                owe_arr.push({ from: "You", amount: borrowed, to: item.addPayer[0].name, to_id: item.addPayer[0].from.toString() })
            }
            if (lent > 0) {
                for await (let payer of item.expanseData.expanse_details) {
                    if (payer.type == "owes")
                        owes_arr.push({ from: payer.name, amount: payer.amount, to: "You", from_id: payer.memberId.toString() })
                }
            }
        }
        expanse.overall = total_lent - total_borrowed;
        console.log(owes_arr, "owes_arr", owe_arr);
        if (owes_arr.length > 0) {
            owes_arr.forEach(item => {
                const key = `${item.from_id}_${item.from}`;
                sums[key] = (sums[key] || 0) + parseInt(item.amount, 10);
            });

            const result = Object.keys(sums).map(key => {
                const [from_id, from] = key.split('_');
                return { from_id, from, amount: sums[key], to: "You" };
            });
            expanse.owes_arr = result;
        } else {
            expanse.owes_arr = {};
        }
        if (owe_arr.length > 0) {
            owe_arr.forEach(item => {
                const key = `${item.to_id}_${item.to}`;
                sums[key] = (sums[key] || 0) + parseInt(item.amount, 10);
            });

            const owe_result = Object.keys(sums).map(key => {
                const [to_id, to] = key.split('_');
                return { to_id, from: "You", amount: sums[key], to };
            });
            expanse.owe_arr = owe_result;
        } else {
            expanse.owe_arr = {};
        }

        res.status(httpStatus.OK).send({ message: 'Expanse list load succesfully', data, expanse });
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