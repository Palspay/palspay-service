const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    description: { type: String, required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    activity_type: { type: String },
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


activitySchema.set('versionKey', false);


const Activity = mongoose.model('activity', activitySchema);

module.exports = Activity;