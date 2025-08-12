const AccountSchema = require('../models/account')
const Destination = require('../models/destination')
const AccountMember = require('../models/account_members')
const LogsSchema = require('../models/log')
const { v4: uuidv4 } = require('uuid');
class AccountController {
    async createAccount(req, res) {

        try {
            const { account_name, website } = req.body;
            if (!account_name || !website) return res.status(400).json({ status: 400, success: false, message: "Missing required fields" });

            const account_id = uuidv4();
            const app_secret_token = uuidv4();

            const account = await AccountSchema.create({
                account_id,
                account_name,
                app_secret_token,
                website,
                created_by: { email: req.user.email }
            })

            return res.status(201).json({
                status: 201,
                success: true, message: 'Account created successfully',
                data: account
            });

        } catch (error) {
            console.log("Error@createAccount", error?.message)
            return res.status(500).json({ status: 500, success: false, message: "Something went wrong" });
        }
    }

    async getAllAccounts(req, res) {
        try {
            const { search } = req.query;
            let query = {};

            if (search) {
                query.account_name = { $regex: search, $options: 'i' };
            }
            const accounts = await AccountSchema.find(query).sort({ createdAt: -1 });

            return res.status(200).json({
                status: 200,
                success: true, message: 'Accounts fetched successfully',
                data: accounts
            })

        } catch (error) {
            console.log("Error@getAllAccounts", error?.message)
            return res.status(500).json({ status: 500, success: false, message: "Something went wrong" });
        }
    }

    async getAccountById(req, res) {
        try {
            const account = await AccountSchema.findOne({ _id: req.params.id });
            if (!account) {
                return res.status(404).json({ success: false, message: 'Account not found' });
            }
            return res.status(200).json({
                status: 200, success: true,
                message: 'Account fetched successfully',
                data: account
            });

        } catch (error) {
            console.log("Error@getAccountById", error?.message)
            return res.status(500).json({ status: 500, success: false, message: "Something went wrong" });
        }
    }

    async updateAccountById(req, res) {
        try {
            const { account_name, website } = req.body;
            console.log("req.user", req.user)
            const email = req.user.user_id.email;
            const updatedAccount = await AccountSchema.findOneAndUpdate(
                { _id: req.params.id },
                { $set: { account_name, website, updated_by: { email: email } } },
                { new: true }
            );
            if (!updatedAccount) {
                return res.status(404).json({ status: 404, success: false, message: 'Account not found' });
            }

            return res.status(200).json({
                status: 200, success: true,
                message: 'Account updated succesfully',
                data: updatedAccount
            })

        } catch (error) {
            console.log("Error@updateAccountById", error?.message)
            return res.status(500).json({ status: 500, success: false, message: "Something went wrong" });
        }

    }

    async deleteAccount(req, res) {
        try {
            const account = await AccountSchema.findOneAndUpdate({ _id: req.params.id });
            if (!account) {
                return res.status(404).json({ status: 404, success: false, message: 'Account not found' });
            }

            await Destination.deleteMany({ account_id: account._id });
            await AccountMember.deleteMany({ account_id: account._id });
            await LogsSchema.deleteMany({ account_id: account._id });

            return res.status(200).json({ status: 200,
                success: true,
                message: 'Account deleted successfully'
            });

        } catch (error) {
            console.log("Error@deleteAccount", error?.message)
            return res.status(500).json({ status: 500, success: false, message: "Something went wrong" });
        }
    }
}

module.exports = new AccountController();