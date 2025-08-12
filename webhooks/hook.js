const AccountSchema = require('../models/account')
const LogSchema = require('../models/log')
const { webhookQueue } = require('../services/queue');
const incomingData = async (req, res) => {

    try {
        const token = req.headers['cl-x-token'];
        const eventId = req.headers['cl-x-event-id'];
        const destination_id = req.body.destination_id
        if(!destination_id) return res.status(400).json({ status: 400, success: false, message: "Destination_id is required" });

        if (!token || !eventId) {
            return res.status(400).json({status: 400, success: false, message: "Missing headers" });
        }
         const account = await AccountSchema.findOne({ app_secret_token: token });
        if (!account) {
            return res.status(403).json({ success: false, message: "Invalid secret token" });
        }
          const log = await LogSchema.create({
            event_id: eventId,
            account_id: account._id,
            destination_id: destination_id,
            received_timestamp: new Date(),
            received_data: req.body,
            status: 'pending'
        });

        await webhookQueue.add('processWebhook', {
            log_id: log._id,
            account_id: account._id,
            payload: req.body
        })

        return res.status(200).json({ success: true, message: "Webhook received" });

    } catch (error) {
        console.log("Error@incomingData", error?.message)
        return res.status(500).json({ status: 500, success: false, message: "Something went wrong" });
    }

}

module.exports = { incomingData }