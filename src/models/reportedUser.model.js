const mongoose = require('mongoose');

const reportedUserSchema = new mongoose.Schema({
    reportedUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // assuming you have a User model
    },
    reportedUserName: {
        type: String,
        required: true
    },
    reportMessage: {
        type: String,
        required: true
    },
    reportedAt: {
        type: Date,
        default: Date.now
    }
});

const ReportedUser = mongoose.model('ReportedUser', reportedUserSchema);

module.exports = ReportedUser;
