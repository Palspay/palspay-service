"use strict";
var mongoose = require('mongoose');
var groupSchema = new mongoose.Schema({
    group_name: { type: String, required: true },
    group_icon: { type: String, default: 'abcgd.png' },
    group_owner: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    owner_only_payment: { type: Boolean, default: false },
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
    }
});
groupSchema.set('versionKey', false);
// /**
//  * @typedef Groups
//  */
var Groups = mongoose.model('groups', groupSchema);
module.exports = Groups;
//# sourceMappingURL=group.model.js.map