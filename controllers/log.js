const LogsSchema = require('../models/log')

class LogController {
    async getLogs(req, res) {
        try {
            const { account_id, status } = req.query;
            if (!account_id) {
                return res.status(400).json({ status: 400, success: false, message: "account_id is required" });
            }
            let filter = { account_id };

            if (status) {
                filter.status = status;
            }

            const logs = await LogsSchema.find(filter)
                .populate('account_id')
                .populate('destination_id')
                .sort({ received_timestamp: -1 });

            return res.status(200).json({ status: 200, success: true, data: logs });

        } catch (error) {
            console.log("Error@getLogs", error?.message);
            return res.status(500).json({ status: 500, success: false, message: "Something went wrong" });
        }
    }

    async getLogById(req, res) {

        try {

            const log = await LogsSchema.findById({ _id: req.params.id })
                .populate('account_id')
                .populate('destination_id');

            if (!log) {
                return res.status(404).json({ status: 404, success: false, message: "Log not found" });
            }

            return res.status(200).json({ status: 200, success: true, data: log });

        } catch (error) {
            console.log("Error@getLogById", error?.message);
            return res.status(500).json({ status: 500, success: false, message: "Something went wrong" });
        }
    }
}

module.exports = new LogController();