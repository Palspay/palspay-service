const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
    memberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    },
    paid: {
        type: Boolean,
        default: false
    },
    paymentId: {
        type: String,
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
    IsPaymentCompleted:{
        type: Boolean,
        default: false
    },
    members: [memberSchema]
}, {
    timestamps: true
});

groupPaymentSchema.set('versionKey', false);

const GroupPayment = mongoose.model('groupPayment', groupPaymentSchema);
 
module.exports = GroupPayment;
