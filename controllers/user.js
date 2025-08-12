const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const UserSchema = require('../models/user')
const AccountModel = require('../models/account')
const RoleSchema = require('../models/role')
const AccountMember = require('../models/account_members')
const jsonwebtoken = require('jsonwebtoken');


class UserController {
    async register(req, res) {
        try {
            const { email, password, account_name, account_id, role_name } = req.body;

            if (!email || !password) {
                return res.status(400).json({ success: false, message: "Missing required fields" });
            }

            let isUserExit = await UserSchema.findOne({ email });
            if (isUserExit) {
                return res.status(400).json({ success: false, message: "User already exists" });
            }

            const passwordHash = await bcrypt.hash(password, 10);

            let user = await UserSchema.create({ email, password: passwordHash });

            let account;
            let role;

            if (account_name && !account_id) {

                const new_account_id = uuidv4();
                const app_secret_token = uuidv4();

                account = await AccountModel.create({
                    account_id: new_account_id,
                    account_name,
                    app_secret_token,
                    created_by: { email: user.email }
                });

                role = await RoleSchema.findOne({ role_name: 'Admin' });

                await AccountMember.create({
                    account_id: account._id,
                    user_id: user._id,
                    role_id: role._id
                });

            }
            else if (account_id && role_name) {

                account = await AccountModel.findOne({ account_id: account_id });

                if (!account) {
                    return res.status(404).json({ success: false, message: "Account not found" });
                }

                role = await RoleSchema.findOne({ role_name: role_name });
                if (!role) {
                    return res.status(400).json({ success: false, message: "Invalid role" });
                }

                await AccountMember.create({
                    account_id: account._id,
                    user_id: user._id,
                    role_id: role._id
                });

            } else {
                return res.status(400).json({ status: 200, success: false, message: "account_id and role_name missing" });
            }

            const account_res = account ? { name: account.account_name } : null

            return res.status(201).json({
                status: 201,
                success: true,
                message: "User registered successfully",
                data: {
                    user: { email: user.email },
                    account: account_res,
                    role: role.role_name
                }
            });

        } catch (error) {
            console.error("Register Error:", error);
            return res.status(500).json({ status: 500, success: false, message: "Something went wrong" });
        }

    }

    async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ status: 400, success: false, message: "Missing required fields" });
            }

            const user = await UserSchema.findOne({ email });

            if (!user) {
                return res.status(404).json({ status: 404, success: false, message: "User not found" });
            }

            const isPasswordMatch = await bcrypt.compare(password, user.password);

            if (!isPasswordMatch) {
                return res.status(401).json({ status: 401, success: false, message: "Invalide credntials" });
            }

            const payload = {
                user_id: user._id,
                email: user.email
            }

            const token = jsonwebtoken.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

            return res.cookie('customer_labs_token', token, { httpOnly: false, secure:true }).status(200)
            .json({ status: 200, success: true, message: "Login successful"});

        } catch (error) {
            console.log("Error@Login", error?.message)
            return res.status(500).json({ status: 500, success: false, message: "Something went wrong" });
        }
    }

    async getUser(req,res){
        try {
            console.log("req.user",req.user)
            const user = await UserSchema.findOne({_id:req.user._id}).select('-password');
            if(!user) return res.status(404).json({ status: 404, success: false, message: "User not found" });
            
            return res.status(200).json({ status: 200, success: true, 
                message: "Sucessfully fetched user", data: user });
            
        } catch (error) {
            console.log("Error@getUser", error?.message)
            return res.status(500).json({ status: 500, success: false, message: "Something went wrong" });
        }

    }
}

module.exports = new UserController();