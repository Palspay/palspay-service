import httpStatus from 'http-status';
import ApiError from '../utills/ApiError';
import mongoose from 'mongoose';
import Transactions from '../models/transaction.model';
import crypto from 'crypto';
import axios from 'axios';
import phonepe from 'phonepesdk-web';
const paymentInitated = async (paymentData) => {
    try {
        const merchantTransactionId = 'M' + Date.now();
        const { price, phone, name, paidTo, userId } = paymentData;
        const data = {
            merchantId: process.env.MERCHANT_ID,
            merchantTransactionId: merchantTransactionId,
            merchantUserId: 'MUID' + userId,
            name: name,
            amount: price * 100,
            redirectUrl: `http://localhost:6000/v1/payment/checkStatus?txnId=${merchantTransactionId}`,
            redirectMode: 'POST',
            paymentInstrument: {
                type: "PAY_PAGE"
            }
        };

        const payload = JSON.stringify(data);
        const payloadMain = Buffer.from(payload).toString('base64');
        const keyIndex = 1;
        const string = payloadMain + '/pg/v1/pay' + process.env.SALT_KEY;
        const sha256 = crypto.createHash('sha256').update(string).digest('hex');
        const checksum = sha256 + '###' + keyIndex;
        const prod_URL = process.env.PHONEPE_URL + "pg/v1/pay"
        const options = {
            method: 'POST',
            url: prod_URL,
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                'X-VERIFY': checksum
            },
            data: {
                request: payloadMain
            }
        };

        phonepe.init({merchantId: process.env.MERCHANT_ID, enableLogging: true, environment: 'SANDBOX'}).then(result => console.log(result));


        // const urlData = await axios.request(options);
        // const paymentInfo = {
        //     userId: paymentData.userId,
        //     paidTo: paidTo,
        //     amount: price,
        //     status: 'Pending',
        //     merchantTransactionId: urlData.data.data.merchantTransactionId
        // }
        const tr = new Transactions(paymentInfo);
        // await tr.save(paymentInfo);
        return 'urlData.data.data.instrumentResponse.redirectInfo';

    } catch (error) {
        console.log(error);
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
    }
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

export default {
    paymentInitated,
    checkStatus
};
