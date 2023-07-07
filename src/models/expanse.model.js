const mongoose = require('mongoose');

const expanseSchema = mongoose.Schema({

    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'groups' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    amount: {
        type: Number,
        required: 0
    },
    description: {
        type: String,
        default: ''
    },
    divisions: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'users',
            },
            amountOwed: {
                type: Number,
                default: 0,
            },
        },
    ],
    is_deleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});


expanseSchema.set('versionKey', false);


/**
 * @typedef Groups
 */
const Expanse = mongoose.model('expanse', expanseSchema);

module.exports = Expanse;