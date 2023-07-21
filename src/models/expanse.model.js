const mongoose = require('mongoose');

const expanseSchema = mongoose.Schema({

    groupId: { type: String, default: '' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    totalExpanse: {
        type: Number,
        required: 0
    },
    description: {
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
        to: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
        },
        from: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
        },
        amount: {
            type: Number,
            default: 0,
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
        status: {
            type: Boolean,
            default: false,
        },
        amount: {
            type: String,
            default: "",
        }
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