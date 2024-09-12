const paymentLinkService = require('../services/paymentLink.service');

// Controller function to handle the creation of the payment link
async function createPaymentLink(req, res) {
  try {
    const { orderId, userId, groupId, friendId } = req.body;

    if (!orderId || !userId) {
      return res.status(400).json({ message: 'Missing required fields: orderId, userId' });
    }

    // Call the service to create a payment link
    const paymentLink = await paymentLinkService.createPaymentLink(orderId, userId, groupId, friendId);

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

module.exports = {
  createPaymentLink,
};
