const GroupMember = require('../../models/group-members.model');
const mongoose = require('mongoose');
const isGroupMember = async (memberId, groupId) => {
    const groupData = await GroupMember.findOne({ member_id: memberId, group_id: new mongoose.Types.ObjectId(groupId), is_friendship: true })
    if(groupData) return true;
    return false;
}

module.exports = {
    isGroupMember
}