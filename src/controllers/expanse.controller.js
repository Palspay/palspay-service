const httpStatus = require('http-status');
const catchAsync = require('../utills/catchAsync');
const { userExpanse } = require('../services');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
import Settlement from "../models/settlement.model";

const addExpanse = catchAsync(async (req, res) => {
    const mergedBody = {
        ...req.body,
        userId: req.userId,
        currentDate: req.currentDate
    }; 

    const expanse_id = await userExpanse.createExpanse(mergedBody);
    res.status(httpStatus.CREATED).send({ message: 'Expanses add succesfully', data: { expanse_id: expanse_id._id } });
});

const addGroupExpanse = catchAsync(async (req, res) => {
    console.log('API called');
    console.log('req.body:', req.body); // Log the request body

    const mergedBody = {
        ...req.body,
        userId: req.userId,
        currentDate: req.currentDate,
    };
    console.log('mergedBody:', mergedBody); // Log the merged body
    const expanse_id = await userExpanse.createExpanse(mergedBody);
    const gpMergedBody = {
        expanseId: expanse_id._id,
        IndividualPaymentAmount: req.body.totalExpanse / req.body.members.length,
        members: req.body.gpMembers,
        IsPaymentCompleted: false
    };
    console.log('gpMergedBody:', gpMergedBody); // Log the gpMergedBody

    try {
        const groupPayment_id = await userExpanse.createGroupPayment(gpMergedBody);

        res.status(httpStatus.CREATED).send({ message: 'Group Expenses added successfully', data: { expanse_id: expanse_id._id, groupPayment_id: groupPayment_id } });
    } catch (error) {
        console.error('Error creating group payment or expense:', error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: 'Error creating group payment or expense' });
    }
});


const updateExpanse = catchAsync(async (req, res) => {
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

const deleteExpanse = catchAsync(async (req, res) => {
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



const getExpanse = catchAsync(async (req, res) => {
    const mergedBody = {
        ...req.body,
        userId: req.userId,
        currentDate: req.currentDate
    };
    const data = await userExpanse.getGroupExpanse(mergedBody);
    if (data) {
        let total_lent = 0,
            total_borrowed = 0,
            owe_arr = [],
            owes_arr = [],
            overall_arr = [];
        
        // Use regular for...of
        for (let item of data.expanseList) {
            mergedBody.id = item._id;
            item.expanseData = await userExpanse.fetchExpanse(mergedBody);
            total_lent += parseFloat(item.expanseData.you_lent) || 0;
            total_borrowed += parseFloat(item.expanseData.you_borrowed) || 0;
            
            let borrowed = parseFloat(item.expanseData.you_borrowed) || 0;
            let lent = parseFloat(item.expanseData.you_lent) || 0;

            if(item.addPayer.length > 0 ){
                if (borrowed > 0) {
                    owe_arr.push({ 
                        from: "You", 
                        amount: borrowed, 
                        to: item.addPayer[0].name, 
                        to_id: item.addPayer[0].from.toString() 
                    });
                }
                if (lent > 0) {
                    for (let payer of item.expanseData.expanse_details) {
                        if (payer.type == "owes")
                            owes_arr.push({ 
                                from: payer.name, 
                                amount: payer.amount, 
                                to: "You", 
                                from_id: payer.memberId.toString() 
                            });
                    }
                }
            }   
        }
        
        data.overall = total_lent - total_borrowed;

        // Separate sums for owe_arr and owes_arr
        const owe_sums = {};
        const owes_sums = {};

        owes_arr.forEach(item => {
            const key = `${item.from_id}_${item.from}`;
            owes_sums[key] = (owes_sums[key] || 0) + parseInt(item.amount, 10);
        });

        const owes_result = Object.keys(owes_sums).map(key => {
            const [from_id, from] = key.split('_');
            return { from_id, from, amount: owes_sums[key], to: "You" };
        });

        owe_arr.forEach(item => {
            const key = `${item.to_id}_${item.to}`;
            owe_sums[key] = (owe_sums[key] || 0) + parseInt(item.amount, 10);
        });

        const owe_result = Object.keys(owe_sums).map(key => {
            const [to_id, to] = key.split('_');
            return { to_id, from: "You", amount: owe_sums[key], to };
        });

        const overall_map = {};

        owes_result.forEach((item) => {
            const key = item.from_id;
            overall_map[key] = overall_map[key] || {
                user: item.from,
                overall: 0,
            };
            overall_map[key].overall += parseInt(item.amount, 10); // they owe you, so positive balance
        });

        // Add owe (you owe them)
        owe_result.forEach((item) => {
            const key = item.to_id;
            overall_map[key] = overall_map[key] || {
                user: item.to,
                overall: 0,
            };
            overall_map[key].overall -= parseInt(item.amount, 10); // you owe them, so negative balance
        });

        // Creating the final overall_arr
        overall_arr = Object.keys(overall_map).map((key) => {
            return {
                user_id: key,
                user: overall_map[key].user,
                overall: overall_map[key].overall,
            };
        });

        data.owe_arr = owe_result;
        data.owes_arr = owes_result;
        data.overall_arr = overall_arr;

        if (data.overall > 0) { 
            data.owed_overall = data.overall;
        } else { 
            data.owe_overall = data.overall; 
        }

        res.status(httpStatus.OK).send({ message: 'Expanse Load successfully', data });
    } else {
        res.status(httpStatus.NO_CONTENT).send({ message: 'No Expanse Data Available' });
    }
});


const fetchExpanse = catchAsync(async (req, res) => {
    const mergedBody = {
        ...req.body,
        id: req.params.id,
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


const getGroupPaymentExpense = async (req, res) => {
    const userId = req.userId; 
    const isPaymentCompleted = req.query.IsPaymentCompleted;
  
    try {
      const groupPayments = await userExpanse.getGroupPaymentExpense(userId, isPaymentCompleted);
      res.status(200).json(groupPayments);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

const updateGroupPaymentStatus = async (req, res) => {
    const { groupPaymentId } = req.params;
    const { memberId, paid } = req.body;
    
  
    try {
      const updatedPayment = await userExpanse.updateGroupPaymentStatus(groupPaymentId, memberId, paid);
      if (!updatedPayment) {
        return res.status(404).json({ message: 'Group payment not found or update failed' });
      }
      res.status(200).json({ message: 'Payment status updated successfully', data: updatedPayment });
    } catch (error) {
      res.status(500).json({ message: `Failed to update payment status: ${error.message}` });
    }
  };

const individualExpanse = catchAsync(async (req, res) => {
    let friendId = (req.query.friendId) ? new ObjectId(req.query.friendId) : null;

    const mergedBody = {
        ...req.body,
        userId: req.userId,
        friendId: friendId,
        currentDate: req.currentDate
    };
    const data = await userExpanse.individualExpanse(mergedBody);

    if (data.length > 0) {
        const sums = {};
        let total_lent = 0,
            total_borrowed = 0,
            owe_arr = [],
            owes_arr = [],
            expanse = {},
            groupDetails = {};

        // Fetch settlements based on the presence of friendId
        const userSettlements = friendId 
            ? await Settlement.find({
                $or: [
                    { paidBy: mergedBody.userId, paidTo: friendId },
                    { paidBy: friendId, paidTo: mergedBody.userId }
                ]
            })
            : await Settlement.find({
                $or: [
                    { paidBy: mergedBody.userId }, // All settlements where the user is the payer
                    { paidTo: mergedBody.userId }  // All settlements where the user is the payee
                ]
            });

        // Calculate total paid amounts
        let totalPaidByUser = 0;
        let totalPaidByFriend = 0;
        userSettlements.forEach(settlement => {
            if (settlement.paidBy.equals(mergedBody.userId)) {
                totalPaidByUser += settlement.amount;
            } else if (friendId && settlement.paidBy.equals(friendId)) {
                totalPaidByFriend += settlement.amount;
            } else if (!friendId) {
                totalPaidByFriend += settlement.amount;
            }
        });

        for await (let item of data) {
            mergedBody.expanseId = item._id;
            total_lent += parseFloat(item.you_lent);
            total_borrowed += parseFloat(item.you_borrowed);
            let borrowed = parseFloat(item.you_borrowed);
            let lent = parseFloat(item.you_lent);

            groupDetails = await userExpanse.getGroupByUser(mergedBody); // Group details for linked user

            if (item.addPayer.length > 0) {
                if (borrowed > 0) {
                    owe_arr.push({ from: "You", amount: borrowed, to: item.addPayer[0].name, to_id: item.addPayer[0].from.toString() });
                }
                if (lent > 0) {
                    for await (let payer of item.expanse_details) {
                        if (payer.type === "owes") {
                            owes_arr.push({ from: payer.name, amount: payer.amount, to: "You", from_id: payer.memberId.toString() });
                        }
                    }
                }
            }
        }

        // Adjust lent/borrowed based on settlements
        total_lent -= totalPaidByFriend;
        total_borrowed -= totalPaidByUser;

        // Calculate final overall after settlements
        expanse.overall = total_lent - total_borrowed;
        expanse.total_lent = total_lent;
        expanse.total_borrowed = total_borrowed;

        // Prepare owes_arr
        if (owes_arr.length > 0) {
            owes_arr.forEach(item => {
                const key = `${item.from_id}_${item.from}`;
                sums[key] = (sums[key] || 0) + parseInt(item.amount, 10);
            });

            expanse.owes_arr = Object.keys(sums).map(key => {
                const [from_id, from] = key.split('_');
                return { from_id, from, amount: sums[key], to: "You" };
            });
        } else {
            expanse.owes_arr = [];
        }

        // Prepare owe_arr
        if (owe_arr.length > 0) {
            owe_arr.forEach(item => {
                const key = `${item.to_id}_${item.to}`;
                sums[key] = (sums[key] || 0) + parseInt(item.amount, 10);
            });

            expanse.owe_arr = Object.keys(sums).map(key => {
                const [to_id, to] = key.split('_');
                return { to_id, from: "You", amount: sums[key], to };
            });
        } else {
            expanse.owe_arr = [];
        }

        res.status(httpStatus.OK).send({ message: 'Expanse list load successfully', data, expanse, groupDetails });
    } else {
        res.status(httpStatus.OK).send({ message: 'Expanse list load successfully', data: [] });
    }
});


  module.exports = {
    addExpanse,
    addGroupExpanse,
    updateExpanse,
    getExpanse,
    fetchExpanse,
    getGroupPaymentExpense,
    deleteExpanse,
    individualExpanse,
    updateGroupPaymentStatus
};