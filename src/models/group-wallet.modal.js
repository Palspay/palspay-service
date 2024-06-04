const mongoose = require('mongoose');

const groupWalletSchema = new mongoose.Schema({
    group_id: { type: mongoose.Schema.Types.ObjectId, ref: 'group' },
    balance: { type: Number, default: 0 }, // This value is in paisa, multiply by 100 to get in rupee
    transactions: [{
        type: { type: String, enum: ['DEPOSIT', 'WITHDRAWAL', 'PAYMENT'] },
        amount: { type: Number },
        timestamp: { type: Date, default: Date.now },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
        vendorId: { type: String }
    }],
});

groupWalletSchema.set('versionKey', false);

// Pre hook to handle balance update on transactions push
groupWalletSchema.pre('findOneAndUpdate', async function(next) {
    const update = this.getUpdate();

    // @ts-ignore
    if (update.$push && update.$push.transactions) {
        // @ts-ignore
        const transaction = update.$push.transactions;
        const wallet = await this.model.findOne(this.getQuery());

        if (transaction.type === 'DEPOSIT') {
            // @ts-ignore
            update.$set = { ...update.$set, balance: wallet.balance + transaction.amount };
        } else if (['WITHDRAWAL', 'PAYMENT'].includes(transaction.type)) {
            // @ts-ignore
            update.$set = { ...update.$set, balance: wallet.balance - transaction.amount };
        }
    }

    next();
});

// Post hook to handle update of multiple transactions
// groupWalletSchema.post('findOneAndUpdate', async function(doc) {
//     if (doc) {
//         doc.balance = doc.transactions.reduce((acc, transaction) => {
//             if (transaction.type === 'DEPOSIT') {
//                 return acc + transaction.amount;
//             } else if (['WITHDRAWAL', 'PAYMENT'].includes(transaction.type)) {
//                 return acc - transaction.amount;
//             }
//             return acc;
//         }, 0);

//         await doc.save();
//     }
// });
// /**
//  * @typedef GroupWallet
//  */
const GroupWallet = mongoose.model('group_wallet', groupWalletSchema);

module.exports = GroupWallet;