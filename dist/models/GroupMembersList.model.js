"use strict";
// models/GroupMembersList.js
var mongoose = require('mongoose');
var groupMembersListSchema = new mongoose.Schema({
    group_id: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});
module.exports = mongoose.model('GroupMembersList', groupMembersListSchema);
//# sourceMappingURL=GroupMembersList.model.js.map