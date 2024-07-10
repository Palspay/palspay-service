"use strict";
var mongoose = require('mongoose');
var groupMemberSchema = new mongoose.Schema({
    group_id: { type: mongoose.Schema.Types.ObjectId, ref: 'groups' },
    member_id: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    created_by: {
        type: String
    },
    modified_by: {
        type: String
    },
    creation_date: {
        type: String
    },
    modification_date: {
        type: String
    },
    is_deleted: {
        type: Boolean,
        default: false
    },
    is_friendship: {
        type: Boolean,
        default: true
    }
});
groupMemberSchema.set('versionKey', false);
// /**
//  * @typedef GroupsMember
//  */
var GroupsMember = mongoose.model('groups_members', groupMemberSchema);
module.exports = GroupsMember;
//# sourceMappingURL=group-members.model.js.map