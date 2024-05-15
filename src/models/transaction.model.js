import mongoose from 'mongoose';

const transactionSchema = mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
        paidTo: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
        amount: { type: String },
        transactionId: { type: String },
        merchantTransactionId: { type: String },
        status: { type: String },
        paymentData: { type: JSON },
        created_by: {
            type: String
        },
        modified_by: {
            type: String
        },
        creation_date: {
            type: String
        },
        modification_date: {
            type: String
        },
        is_deleted: {
            type: Boolean,
            default: false
        }
    },
);


transactionSchema.set('versionKey', false);


/**
 * @typedef Groups
 */
const Transactions = mongoose.model('transactions', transactionSchema);

export default Transactions;