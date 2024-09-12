const mongoose = require('mongoose');

const paymentLinkSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  orderId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  groupId: {
    type: String,
    required: false,
  },
  friendId: {
    type: String,
    required: false,
  },
  // Any other fields you need
}, { timestamps: true });

const PaymentLink = mongoose.model('PaymentLink', paymentLinkSchema);

module.exports = PaymentLink;
