const axios = require('axios');
require('dotenv').config();

const sendOtp = async (mobileNumber, otp) => {
  const url = `https://control.msg91.com/api/v5/otp`;
  
  const data = {
    mobile: mobileNumber,
    otp: otp,
    authkey: process.env.MSG91_API_KEY,
    template_id: process.env.MSG91_TEMPLATE_ID,  // Optional, based on your setup
  };

  try {
    const response = await axios.post(url, data);
    return response.data;
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw error;
  }
};

module.exports = { sendOtp };
