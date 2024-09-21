const mongoose = require('mongoose');

const paymentLinkSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  orderId: {
    type: String,
    required: false,
  },
  ReminderBy: {
    type: String,
    required: true,
  },
  ReminderFor: {
    type: String,
    required: true,
  },
  reminderType: {
    type: String,
    enum: ['Normal', 'Group', 'GroupPayment'],
    required: true,
    default: 'Normal', // Default reminder type is 'Normal'
  },
  groupId: {
    type: String,
    ref: 'Groups',
    required: false, // Only needed for 'Group' or 'GroupPayment' reminders
  },
  groupPayment: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the group payment object
    ref: 'GroupPayment',
    required: false, // Assuming 'GroupPayment' is another model in your app
  },
}, { timestamps: true });

const PaymentLink = mongoose.model('PaymentLink', paymentLinkSchema);

module.exports = PaymentLink;
