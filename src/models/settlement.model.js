import mongoose from 'mongoose';

const settlementSchema = new mongoose.Schema({
  paidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  paidTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
  creation_date: {
    type: String,
  },
  status: { type: String, enum: ['SETTLED', 'PENDING'], default: 'PENDING' },
  settleUpBy: {
    type: String,
    enum: ['razorpay', 'cash'],
    required: true,
  },
});

const Settlement = mongoose.model('Settlement', settlementSchema);

export default Settlement;