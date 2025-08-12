const mongoose = require('mongoose');

const RoleModule = new mongoose.Schema({
    role_name : {
        type: String,
        required: [true, 'role_name  is required'],
        unique: [true, 'role_name  is unique']
    },

}, { timestamps: true });

const Role = mongoose.model('role', RoleModule)
module.exports = Role;