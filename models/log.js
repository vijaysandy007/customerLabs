const mongoose = require('mongoose')

const LogModule = new mongoose.Schema({
    event_id:{
        type:String,
        required:[true,'event_id is required'],
        unique:[true,'event_id is unique']
    },
    account_id:{
        type:mongoose.Schema.ObjectId,
        ref:'account',
        required:[true,'account_id is required']
    },
    received_timestamp:{
        type:Date,
        default: Date.now
    },
    processed_timestamp:{
        type:Date
    },
    destination_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'destination',
        required:[true,'destination_id is required']
    },
    received_data:{
        type:mongoose.Schema.Types.Mixed
    },
    status :{
        type:String,
        enum: ['success', 'failed', 'pending'],
        default:'success',
        required:[true,'status is required']
    }

});

const Log = mongoose.model('log',LogModule)
module.exports = Log