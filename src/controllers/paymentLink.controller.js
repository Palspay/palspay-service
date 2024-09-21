const paymentLinkService = require('../services/paymentLink.service');
const PaymentLink = require('../models/paymentLink.model');

// Controller function to handle the creation of the payment link
async function createPaymentLink(req, res) {
  try {
    const { orderId, ReminderBy, groupId, ReminderFor } = req.body;

    if (!orderId || !ReminderBy) {
      return res.status(400).json({ message: 'Missing required fields: orderId, ReminderBy' });
    }

    if (!ReminderFor) {
      return res.status(400).json({ message: 'Missing required fields: ReminderFor' });
    }


    // Call the service to create a payment link
    const paymentLink = await paymentLinkService.createPaymentLink(orderId, ReminderBy, groupId, ReminderFor);

    // Respond with the generated payment link details
    res.status(201).json({
      message: 'Payment link generated successfully',
      link: `https://app.palspayapp.com/pay/?${paymentLink.code}`,
      details: paymentLink,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

async function getPaymentLinkDetails(code) {
    // Find the payment link using the code
    const paymentLink = await PaymentLink.findOne({ code });
    return paymentLink;
  }

module.exports = {
  createPaymentLink, getPaymentLinkDetails
};
