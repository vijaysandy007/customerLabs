const mongoose = require('mongoose')

const AccountModule = new mongoose.Schema({
    account_id:{
        type:String,
        required:[true,'account_id is required'],
        unique:[true,'account_id is unique']
    },
    account_name:{
        type:String,
        required: [true, 'account_name is required'],
    },
    app_secret_token:{
        type:String,
         required: [true, 'app_secret_token is required']
    },
    website:{
        type:String
    },
    created_by:{
        type:mongoose.Schema.Types.Mixed
    },
    updated_by:{
        type:mongoose.Schema.Types.Mixed
    }
},{timestamps:true});

const Account = mongoose.model('account',AccountModule)
module.exports = Account;