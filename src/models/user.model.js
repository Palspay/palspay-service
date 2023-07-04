const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
        },
        mobile: {
            type: String,
            require: true
        },
        is_deleted: {
            type: Boolean,
            default: false
        },
        is_registered: {
            type: Boolean,
            default: false,
        },
        invite_token: {
            type: String
        }
    },
    {
        timestamps: true,
    }
);



userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

userSchema.set('versionKey', false);


/**
 * @typedef User
 */
const User = mongoose.model('users', userSchema);

module.exports = User;