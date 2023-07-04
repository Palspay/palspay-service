const mongoose = require('mongoose');

const friendsSchema = mongoose.Schema(
    {
        friend_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'users'
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'users'
        },
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
        status: {
            type: Boolean,
            default: true
        },
        is_deleted: {
            type: Boolean,
            default:false
        }
    },
);


friendsSchema.set('versionKey', false);


/**
 * @typedef Invite
 */
const Friends = mongoose.model('friends', friendsSchema);

module.exports = Friends;