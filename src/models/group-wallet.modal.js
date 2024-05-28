const mongoose = require('mongoose');

const groupWalletSchema = new mongoose.Schema({
    group_id: { type: mongoose.Schema.Types.ObjectId, ref: 'group' },
    balance: { type: Number, default: 0 }, // This value is in paisa, multiple by 100 to get in rupee
    transactions: [{
        type: { type: String, enum: ['deposit', 'withdrawal', 'payment'] },
        amount: { type: Number },
        timestamp: { type: Date, default: Date.now },
        participants: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    }],
});

groupWalletSchema.set('versionKey', false);


// /**
//  * @typedef GroupWallet
//  */
const GroupWallet = mongoose.model('group_wallet', groupWalletSchema);

module.exports = GroupWallet;