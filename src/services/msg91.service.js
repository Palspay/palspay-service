const axios = require('axios');
require('dotenv').config();

const sendOtp = async (mobileNumber, otp) => {
  const url = `https://control.msg91.com/api/v5/otp`;
  
  const data = {
    mobile: mobileNumber,
    otp: otp,
    authkey: process.env.MSG91_API_KEY,
    template_id: process.env.MSG91_OTP_TEMPLATE_ID,  // Optional, based on your setup
  };

  try {
    const response = await axios.post(url, data);
    return response.data;
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw error;
  }
};

const sendReminderFriend = async (mobileNumber, friendName, amount, link) => {
  const url = 'https://control.msg91.com/api/v5/flow';

  const data = {
    template_id: '66e15eafd6fc053b4324efa1',  // Template ID provided
    recipients: [
      {
        mobiles: mobileNumber,
        amount: amount,  
        description: friendName,  
        link: link
      }
    ]
  };

  const headers = {
    'authkey': process.env.MSG91_API_KEY,
    'Accept': 'application/json'
  };

  try {
    const response = await axios.post(url, data, { headers });
    return response.data;
  } catch (error) {
    console.error('Error sending reminder:', error);
    throw error;
  }
};


module.exports = { sendOtp, sendReminderFriend };
