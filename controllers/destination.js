const DestinationModel = require("../models/destination");
const AccountModel = require("../models/account");
class DestinationController {

    async addDestination(req, res) {
        try {
            const { accountId } = req.params;
            const { url, http, headers } = req.body;

            const account = await AccountModel.findOne({ _id: accountId });

            if (!account) {
                return res.status(404).json({ success: false, message: "Account not found" });
            }
            const destination = await DestinationModel.create({
                account_id: account._id,
                url,
                http,
                headers,
                created_by: { email: req.user.user_id?.email }
            });

            return res.status(201).json({ status: 201, success: true, message: "Destination created", data: destination });

        } catch (error) {
            console.log("Error@addDestination", error?.message)
            return res.status(500).json({ status: 500, success: false, message: "Something went wrong" });
        }
    }

    async getDestinationByAccountId(req, res) {
        try {
            const { accountId } = req.params
            const destinations = await DestinationModel.find({ account_id: accountId }).populate("account_id", "account_name")
                .sort({ createdAt: -1 });

            return res.status(200).json({ status: 200, success: true, message: "Destinations fetched", data: destinations });

        } catch (error) {
            console.log("Error@getDestinationByAccountId", error?.message)
            return res.status(500).json({ status: 500, success: false, message: "Something went wrong" });
        }
    }

    async updateDestination(req, res) {
        try {
            const { id } = req.params;
            const { url, http, headers } = req.body;
            const email = req.user?.user_id?.email || req.user?.email;
            console.log("email", email)

            const updated = await DestinationModel.findOneAndUpdate({ _id: id, }, {
                $set: {
                    url,
                    http,
                    headers,
                    updated_by: { email: email }
                }

            }, { new: true });
            if (!updated) return res.status(404).json({ status: 404, success: false, message: "Destination not found" });

            return res.status(200).json({ status: 200, success: true, message: "Destination updated", data: updated });

        } catch (error) {
            console.log("Error@updateDestination", error?.message)
            return res.status(500).json({ status: 500, success: false, message: "Something went wrong" });
        }
    }

    async deleteDestination(req, res) {
        try {
            const { destination_id } = req.body;
            console.log("destination_id", destination_id)

            if(!destination_id) return res.status(400).json({ status: 400, success: false, message: "Destination ID is required" });

            const deleted = await DestinationModel.findOneAndDelete({ _id: destination_id });
            if (!deleted) return res.status(404).json({ status: 404, success: false, message: "Destination not found" });

            return res.status(200).json({ status: 200, success: true, message: "Destination deleted" });

        } catch (error) {
            console.log("Error@deleteDestination", error?.message)
            return res.status(500).json({ status: 500, success: false, message: "Something went wrong" });
        }
    }
}

module.exports = new DestinationController();