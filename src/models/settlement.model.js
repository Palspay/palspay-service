const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Settlement Schema
const SettlementSchema = new Schema({
  paidBy_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model
    required: true
  },
  paidTo_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the user receiving the payment
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  transaction_date: {
    type: Date,
    default: Date.now
  },
  remaining_balance_before: {
    type: Number,
    required: true
  },
  remaining_balance_after: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  group_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group', // Assuming you have a Group model
    required: false, // Not all settlements will be done in groups
    default: null
  }
});

// Create the Settlement model
const Settlement = mongoose.model('Settlement', SettlementSchema);

module.exports = Settlement;
