const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
    memberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    paid: {
        type: Boolean,
        default: false
    },
    paymentId: {
        type: Number,
        required: true
    }
}, { _id: false });

const groupPaymentSchema = new mongoose.Schema({
    expanseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'expanse',
        required: true
    },
    IndividualPaymentAmount: {
        type: Number,
        default: 0
    },
    members: [memberSchema]
}, {
    timestamps: true
});

groupPaymentSchema.set('versionKey', false);

const GroupPayment = mongoose.model('groupPayment', groupPaymentSchema);

module.exports = GroupPayment;
