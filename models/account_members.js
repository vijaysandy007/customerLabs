const mongoose = require('mongoose');

const AccountMembers = new mongoose.Schema({
    account_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'account',
        required: [true, 'account_id is required']
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'user_id is required']
    },
    role_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'role',
        required: [true, 'role_id is required']
    }
}, { timestamps: true });

const AccountMembersSchema = mongoose.model('account_members', AccountMembers)
module.exports = AccountMembersSchema;