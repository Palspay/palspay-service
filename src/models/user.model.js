const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
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
    fb_id: {
        type: String,
        default: ' '
    },
    gmail_id: {
        type: String,
        default: ' '
    },
    passcode: {
        type: Number,
        default: null
    },
    timezone: {
        type: String,
        default: ''
    },
    currency: {
        type: String,
        default: 'INR'
    },
    otp: {
        type: String,
        default: ''
    },
    dp: {
        type: String,
        default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOf4qJRYPgwBbgs84YIzoacDvWMB4EYAp_HA&usqp=CAU'
    },
    is_temp_registered: {
        type: Boolean,
        default: false,
    },
    is_otp_verify: {
        type: Boolean,
        default: false,
    },
    is_passcode_enter: {
        type: Boolean,
        default: false,
    },
    invite_token: {
        type: String
    },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
    creation_date: {
        type: Number,
        default: null
    },
    modification_date: {
        type: Number,
        default: null
    },
    user_type: {
        type: String,
        default: 'USER',
    },
    plan_id: { type: mongoose.Schema.Types.ObjectId, ref: 'plans' },
    plan_expired: {
        type: Number,
    },
    plan_selected_date: {
        type: Number,
    }
});



userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

userSchema.set('versionKey', false);


// /**
//  * @typedef User
//  */
const User = mongoose.model('users', userSchema);

module.exports = User;