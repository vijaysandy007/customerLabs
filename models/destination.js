const mongoose = require('mongoose')

const DestinationModule = new mongoose.Schema({
    url: {
        type: String,
        required: [true, 'url is required'],
    },
    account_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'account',
        required: [true, 'account_id is required']
    },
    http: {
        type: String,
        required: [true, 'http is required'],
        enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
    },
    headers: {
        type: Map,
        of: String,
        required: [true, 'headers is required']
    },
    updated_by:{
        type:mongoose.Schema.Types.Mixed
    }
}, { timestamps: true });

const Destination = mongoose.model('destination', DestinationModule)
module.exports = Destination;