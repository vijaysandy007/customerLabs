const mongoose = require('mongoose');

const UserModule = new mongoose.Schema({
    email:{
        type:String,
        required:[true,'email is required'],
        unique:[true,'email is unique']
    },
    password:{
        type:String,
        required:[true,'password is required']
    }
},{timestamps:true});

const User = mongoose.model('user',UserModule)
module.exports = User