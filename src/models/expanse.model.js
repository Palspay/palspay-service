const mongoose = require('mongoose');

const expanseSchema = new mongoose.Schema({
    groupId: { type: String, default: '' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    // @ts-ignore
    totalExpanse: {
        type: Number,
        required: 0
    },
    description: {
        type: String,
        default: ''
    },
    currency: {
        type: String,
        default: ''
    },
    imagesArray: [{
        imgS3Key: {
            type: String,
            default: ''
        },
        imgName: {
            type: String,
            default: ''
        },
        isPrimary: {
            type: Boolean,
            default: false
        }
    }],
    addPayer: [{
        from: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
        },
        amount: {
            type: Number,
            default: 0,
        }
    }],
    members: [{
        memberId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
        },
        is_settled: {
            type: Boolean,
            default: false,
        },
    }],
    splitEqually: [{
        memberId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
        },
        status: {
            type: Boolean,
            default: false,
        },
        amount: {
            type: String,
            default: "",
        }
    }],
    splitUnequally: [{
        memberId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
        },
        status: {
            type: Boolean,
            default: false,
        },
        amount: {
            type: String,
            default: "",
        }
    }],
    splitByPercentage: [{
        memberId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
        },
        percentage: {
            type: String,
            default: "",
        },
        amount: {
            type: String,
            default: "",
        },
        status: {
            type: Boolean,
            default: false,
        },
    }],
    splitByShare: [{
        memberId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
        },
        status: {
            type: Boolean,
            default: false,
        },
        share: {
            type: String,
            default: ''
        },
        amount: {
            type: String,
            default: "",
        }
    }],
    splitByAdjustments: [{
        memberId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
        },
        status: {
            type: Boolean,
            default: false,
        },
        amount: {
            type: String,
            default: "",
        }
    }],
    is_settled: {
        type: Boolean,
        default: false
    },
    is_deleted: {
        type: Boolean,
        default: false
    },
    expenseType: {
        type: String,
        enum: ['Normal Expense', 'Group Payment', 'Wallet Payment'],
        required: true
    }
}, {
    timestamps: true
});

expanseSchema.set('versionKey', false);

const Expanse = mongoose.model('expanse', expanseSchema);

module.exports = Expanse;
