const PaymentLink = require('../models/paymentLink.model');
const crypto = require('crypto');

// Generate a unique 6-character code
function generateUniqueCode(length = 6) {
  return crypto.randomBytes(length).toString('hex').slice(0, length);
}

async function createPaymentLink(orderId, userId, groupId, friendId) {
  let code;
  let existingLink;

  // Ensure that the generated code is unique
  do {
    code = generateUniqueCode();
    existingLink = await PaymentLink.findOne({ code });
  } while (existingLink);

  // Create and save the new payment link in the database
  const newLink = new PaymentLink({
    code,
    orderId,
    userId,
    groupId,
    friendId,
  });

  await newLink.save();

  return newLink;
}

module.exports = {
  createPaymentLink,
};
