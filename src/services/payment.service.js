const httpStatus = require('http-status');
const ApiError = require('../utills/ApiError');
const mongoose = require('mongoose');
const { Transactions, PaymentStatus } = require('../models/transaction.model');
const crypto = require('crypto');
const axios = require('axios');
const razorpay = require('../utills/razorpay');
const paymentInitated = async (paymentData) => {
    const { amount, paidTo, userId } = paymentData;
    try {
        const merchantTransactionId = 'MTRX' + Math.floor(Math.random() * 1000000000);
        const order = await razorpay.orders.create({
            "amount": amount,
            "currency": "INR",
            "receipt": "receipt#1",
            "partial_payment": false,
            "notes": {
                "key1": "value3",
                "key2": "value2"
            }
        })
        const orderData = {
            userId,
            paidTo,
            amount,
            transactionId: merchantTransactionId,
            status: PaymentStatus.PAYMENT_INITIATED,
            paymentData: order,

        }
        await Transactions.create(orderData);
        // await new Transactions(orderData).save();
        //   const merchantTransactionId = 'M' + Date.now();
        // const { price, phone, name, paidTo } = paymentData;
        // const data = {
        //     merchantId: process.env.MERCHANT_ID,
        //     merchantTransactionId: merchantTransactionId,
        //     merchantUserId: 'MUID' + paymentData.userId,
        //     name: name,
        //     amount: price * 100,
        //     redirectUrl: `http://localhost:6000/v1/payment/checkStatus?txnId=${merchantTransactionId}`,
        //     redirectMode: 'POST',
        //     mobileNumber: phone,
        //     paymentInstrument: {
        //         type: 'PAY_PAGE'
        //     }
        // };
        // const payload = JSON.stringify(data);
        // const payloadMain = Buffer.from(payload).toString('base64');
        // const keyIndex = 1;
        // const string = payloadMain + '/pg/v1/pay' + process.env.SALT_KEY;
        // const sha256 = crypto.createHash('sha256').update(string).digest('hex');
        // const checksum = sha256 + '###' + keyIndex;
        // const prod_URL = process.env.PHONEPE_URL
        // const options = {
        //     method: 'POST',
        //     url: prod_URL,
        //     headers: {
        //         accept: 'application/json',
        //         'Content-Type': 'application/json',
        //         'X-VERIFY': checksum
        //     },
        //     data: {
        //         request: payloadMain
        //     }
        // };

        // const urlData = await axios.request(options);
        // const paymentInfo = {
        //     userId: paymentData.userId,
        //     paidTo: paidTo,
        //     amount: price,
        //     status: 'PAYMENT_INITIATED',
        //     merchantTransactionId: urlData.data.data.merchantTransactionId
        // }
        // const tr = new Transactions(paymentInfo);
        // await tr.save(paymentInfo);
        // return urlData.data.data.instrumentResponse.redirectInfo;
        return orderData;

    } catch (error) {
        console.log(error);
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
    }
}

const payoutInitated = async (payoutData) => {
    const { paymentId } = payoutData;
    const paymentInfo = {
        status: 'PAYOUT_INITITATED'
    }
    await Transactions.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(paymentId) }, { $set: { ...paymentInfo } }).lean();
}

const refundInitiated = async (refundData) => {
    const { paymentId } = payoutData;
    const paymentInfo = {
        status: 'REFUND_INITITATED'
    }
    await Transactions.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(paymentId) }, { $set: { ...paymentInfo } }).lean();
}

const checkStatus = async (body) => {
    const merchantTransactionId = body.txnId;
    const merchantId = process.env.MERCHANT_ID
    const keyIndex = 1;
    const string = `/pg/v1/status/${merchantId}/${merchantTransactionId}` + process.env.SALT_KEY;
    const sha256 = crypto.createHash('sha256').update(string).digest('hex');
    const checksum = sha256 + "###" + keyIndex;
    const options = {
        method: 'GET',
        url: `https://api-preprod.phonepe.com/apis/hermes/pg/v1/status/${merchantId}/${merchantTransactionId}`,
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            'X-VERIFY': checksum,
            'X-MERCHANT-ID': `${merchantId}`
        }
    };
    // CHECK PAYMENT STATUS
    const status = await axios.request(options);
    try {
        if (status.status) {
            const paymentInfo = {
                paymentData: status.data.data.paymentInstrument,
                status: status.data.success ? 'Success' : 'Failed',
            }
            await Transactions.findOneAndUpdate({ merchantTransactionId: status.data.data.merchantTransactionId, }, { $set: paymentInfo }).lean();
            return { message: status.data.message };
        } else {
            return { message: 'Paymemt failed' }
        }
    } catch (error) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
    }

};

module.exports = {
    paymentInitated,
    checkStatus,
    payoutInitated,
    refundInitiated
};
