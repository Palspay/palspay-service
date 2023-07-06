const mongoose = require('mongoose');

const expensesSchema = mongoose.Schema(
    {
        description: {
            type: String,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        payer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        group: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Group',
            required: true,
        },
        divisions: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                },
                amountOwed: {
                    type: Number,
                    default: 0,
                },
            },
        ],
    },
)
expensesSchema.set('versionKey', false);


/**
 * @typedef Expanses
 */
const Expanses = mongoose.model('expanse_master', expensesSchema);

module.exports = Expanses;