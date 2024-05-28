const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    group_name: { type: String, required: true },
    group_icon: { type: String, default: 'abcgd.png' },
    group_owner: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
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
const Groups = mongoose.model('groups', groupSchema);

module.exports = Groups;