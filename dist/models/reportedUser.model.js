"use strict";
var mongoose = require('mongoose');
var reportedUserSchema = new mongoose.Schema({
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
module.exports = mongoose.model('ReportedUser', reportedUserSchema);
//# sourceMappingURL=reportedUser.model.js.map