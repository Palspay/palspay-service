import httpStatus from "http-status";
import ApiError from "../utills/ApiError";
import mongoose from "mongoose";
import { Transactions, PaymentStatus } from "../models/transaction.model";
import crypto from "crypto";
import axios from "axios";
import razorpay from "../utills/razorpay";
var {
  validatePaymentVerification,
} = require("razorpay/dist/utils/razorpay-utils");
const paymentInitated = async (paymentData) => {
  const { amount, paidTo, userId } = paymentData;
  try {
    const merchantTransactionId =
      "MTRX" + Math.floor(Math.random() * 1000000000);
    const order = await razorpay.orders.create({
      amount: amount,
      currency: "INR",
      receipt: "receipt#1",
      partial_payment: false,
      notes: {
        key1: "value3",
        key2: "value2",
      },
    });
    const orderData = {
      userId,
      paidTo,
      amount,
      transactionId: merchantTransactionId,
      status: PaymentStatus.PAYMENT_INITIATED,
      paymentData: order,
    };
    const data = await Transactions.create(orderData);
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
    return data;
  } catch (error) {
    console.log(error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Internal Server Error"
    );
  }
};

const payoutInitated = async (payoutData) => {
  const { paymentId, signature, transactionId } = payoutData;

  const data = await Transactions.findOne({
    _id: transactionId
  });

  // crypto.createHmac('sha256', "key").update("message").digest("base64");
  // const generatedSignature = hmac_sha256(order_id + "|" + razorpay_payment_id, secret);
  // if (generatedSignature == signature) {
  //   console.log("Signature verified successfully");
  // }
  const validPayment = validatePaymentVerification(
    // @ts-ignore
    { order_id: data?.paymentData?.id, payment_id: paymentId },
    signature,
    process.env.RAZORPAY_KEY_SECRET
  );

  const payoutRequest = {
    account_number: "2323230082686509",
    amount: 10000,
    currency: "INR",
    mode: "UPI",
    purpose: "refund",
    fund_account: {
      account_type: "vpa",
      vpa: {
        address: "gauravkumar@exampleupi",
      },
      contact: {
        name: "Gaurav Kumar",
        email: "gaurav.kumar@example.com",
        contact: "9876543210",
        type: "employee",
        reference_id: "Acme Contact ID 12345",
        notes: {
          notes_key_1: "Tea, Earl Grey, Hot",
          notes_key_2: "Tea, Earl Grey… decaf.",
        },
      },
    },
    queue_if_low_balance: true,
    reference_id: "Acme Transaction ID 12345",
    narration: "Acme Corp Fund Transfer",
    notes: {
      notes_key_1: "Beam me up Scotty",
      notes_key_2: "Engage",
    },
  };
  const options = {
    method: "POST",
    url: process.env.RAZORPAY_URL + "/v1/payouts",
    auth: {
      username: process.env.RAZORPAY_KEY_ID,
      password: process.env.RAZORPAY_KEY_SECRET,
    },
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    data: {
      ...payoutRequest,
    },
  };

  const urlData = await axios.request(options);

  const paymentInfo = {
    status: "PAYOUT_INITITATED",
  };
  const response = await Transactions.findOneAndUpdate(
    { _id: transactionId },
    { $set: { ...paymentInfo } }
  ).lean();
  return response;
};

const refundInitiated = async (refundData) => {
  // @ts-ignore
  const { paymentId } = refundData;
  const paymentInfo = {
    status: "REFUND_INITITATED",
  };
  await Transactions.findOneAndUpdate(
    { _id: new mongoose.Types.ObjectId(paymentId) },
    { $set: { ...paymentInfo } }
  ).lean();
};

const addToWallet = async (paymentInfo) => {
  await Transactions.findOneAndUpdate(
    { _id: paymentInfo.transactionId },
    { $set: { ...paymentInfo } }
  ).lean();
};

const checkStatus = async (body) => {
  const merchantTransactionId = body.txnId;
  const merchantId = process.env.MERCHANT_ID;
  const keyIndex = 1;
  const string =
    `/pg/v1/status/${merchantId}/${merchantTransactionId}` +
    process.env.SALT_KEY;
  const sha256 = crypto.createHash("sha256").update(string).digest("hex");
  const checksum = sha256 + "###" + keyIndex;
  const options = {
    method: "GET",
    url: `https://api-preprod.phonepe.com/apis/hermes/pg/v1/status/${merchantId}/${merchantTransactionId}`,
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      "X-VERIFY": checksum,
      "X-MERCHANT-ID": `${merchantId}`,
    },
  };
  // CHECK PAYMENT STATUS
  const status = await axios.request(options);
  try {
    if (status.status) {
      const paymentInfo = {
        paymentData: status.data.data.paymentInstrument,
        status: status.data.success ? "Success" : "Failed",
      };
      await Transactions.findOneAndUpdate(
        { merchantTransactionId: status.data.data.merchantTransactionId },
        { $set: paymentInfo }
      ).lean();
      return { message: status.data.message };
    } else {
      return { message: "Paymemt failed" };
    }
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Internal Server Error"
    );
  }
};

export { paymentInitated, payoutInitated, refundInitiated, checkStatus, addToWallet };
