import httpStatus from "http-status";
import ApiError from "../utills/ApiError";
import mongoose from "mongoose";
import { Transactions, PaymentStatus } from "../models/transaction.model";
import crypto from "crypto";
import axios from "axios";
import razorpay from "../utills/razorpay";
import GroupWallet from "../models/group-wallet.modal";
import { User } from "../models";
import { email } from "../config/config";
var {
  validatePaymentVerification,
} = require("razorpay/dist/utils/razorpay-utils");
const paymentInitated = async (paymentData) => {
  const { amount, paidTo, userId, groupId } = paymentData;
  try {
    const order = await razorpay.orders.create({
      amount: amount,
      currency: "INR",
      partial_payment: false,
      notes: {
        groupId: groupId,
      },
    });
    const orderData = {
      userId,
      paidTo,
      amount,
      status: PaymentStatus.PAYMENT_INITIATED,
      paymentData: order,
    };
    const data = await Transactions.create(orderData);
    return {
      // @ts-ignore
      orderId: data?.paymentData?.id,
      transactionId: data._id,

    };
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

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await validatePayment(data, paymentId, signature);
    const userData = await User.findOne({ _id: data.paidTo });
    if (!userData) {
      throw new ApiError(httpStatus.NOT_FOUND, "user not found");
    }
    if (!userData.vpa || userData.vpa === "") {
      throw new ApiError(httpStatus.NOT_FOUND, "VPA not set for receiver");
    }

    const paymentInfo = {
      status: "PAYOUT_INITITATED",
    };
    const response = await Transactions.findOneAndUpdate(
      { _id: transactionId },
      { $set: { ...paymentInfo } }
    ).lean();

    const payoutData = {
      amount: data.amount,
      vpa: userData.vpa,
      name: userData.name,
      userId: userData._id,
      email: userData.email,
      mobile: userData.mobile,
      transactionId: data._id
    }
    const payoutResponse = await razorpayPayout(payoutData);
    if (payoutResponse.status === 200) {
      await session.commitTransaction();
      session.endSession();
      return { paymentStatus: payoutResponse?.data?.status };
    }
    return response;
  } catch (error) {
    console.log(error);
    await session.abortTransaction();
    session.endSession();
    const refundResponse = await razorpay.payments.refund(paymentId, {
      amount: data.amount,
      speed: "normal",
      notes: {
        reason: "Payout failure",
      },
    });

    if (refundResponse.status !== 'processed') {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Internal Server Error, Contact admin for refund."
      );
    }
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Internal Server Error, Refund initiated."
    );
  }
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

const addToWallet = async (paymentData) => {
  try {
    const { paymentId, signature, transactionId } = paymentData;
    const data = await Transactions.findOne({
      _id: transactionId
    });
    await validatePayment(data, paymentId, signature);
    const wallet = await GroupWallet.findOneAndUpdate({ group_id: paymentData.groupId },
      { $push: { transactions: { type: 'DEPOSIT', amount: paymentData.amount, userId: paymentData.userId } } }, { new: true }
    )
    return wallet;
  }
  catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
  }
};

const makePayment = async (paymentData) => {
  const transactionInfo = {
    type: "PAYMENT",
    amount: paymentData.amount,
    vendorId: paymentData.vpa
  };
  const wallet = await GroupWallet.findOne({
    group_id: paymentData.groupId
  });

  if (wallet.balance < paymentData.amount) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Insufficient Balance");
  }
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await GroupWallet.findOneAndUpdate({ group_id: paymentData.groupId },
      { $push: { transactions: transactionInfo } }, { new: true }
    )
    const payoutData = {
      amount: paymentData.amount,
      vpa: paymentData.vpa,
      name: paymentData.name,
      userId: paymentData.vpa,
      email: paymentData.email,
      mobile: paymentData.mobile,
      transactionId: ""
    }
    const payoutResponse = await razorpayPayout(payoutData);
    if (payoutResponse.status === 200) {
      await session.commitTransaction();
      session.endSession();
      return { paymentStatus: payoutResponse?.data?.status };
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Internal Server Error, Payment failed."
    );
  }

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

async function validatePayment(data, paymentId, signature) {
  const validPayment = validatePaymentVerification(
    // @ts-ignore
    { order_id: data?.paymentData?.id, payment_id: paymentId },
    signature,
    process.env.RAZORPAY_KEY_SECRET
  );

  if (!validPayment) {
    const order = await razorpay.payments.refund(paymentId, {
      amount: data.amount,
      speed: "normal",
      notes: {
        reason: "Payout failure",
      },
    });
    console.log(order);
    throw new ApiError(httpStatus.BAD_REQUEST, "Payment verification failed");
  }
}

async function razorpayPayout(data) {
  const payoutRequest = {
    account_number: process.env.RAZORPAY_ACCOUNT_NUMBER,
    amount: data.amount,
    currency: "INR",
    mode: "UPI",
    purpose: "payout",
    fund_account: {
      account_type: "vpa",
      vpa: {
        address: data.vpa,
      },
      contact: {
        name: data.name,
        email: data.email,
        contact: data.mobile,
        type: "employee",
        reference_id: data.userId,
        // notes: {
        //   notes_key_1: "Tea, Earl Grey, Hot",
        //   notes_key_2: "Tea, Earl Grey… decaf.",
        // },
      },
    },
    queue_if_low_balance: true,
    reference_id: data.transactionId,
    narration: "PalsPay payment",
    // notes: {
    //   notes_key_1: "Beam me up Scotty",
    //   notes_key_2: "Engage",
    // },
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
  try {
    const response = await axios.request(options);
    return response
  } catch (error) {
    console.log(error);
    throw error;
  }
}


export { paymentInitated, payoutInitated, refundInitiated, checkStatus, addToWallet, makePayment };
