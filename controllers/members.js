const AccountMemeberModel = require("../models/account_members");
const UserSchema = require("../models/user");
const AccountSchema = require("../models/account");
const RoleSchema = require("../models/role");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

class MemberController {
    async inviteMember(req, res) {
        try {
            const { email, role_name } = req.body;
            const { accountId } = req.params;

            if (!email || !role_name) {
                return res
                    .status(400)
                    .json({
                        success: false,
                        message: "Missding field required ex: email, role_name",
                    });
            }
            const account = await AccountSchema.findOne({ account_id: accountId });
            if (!account) {
                return res
                    .status(404)
                    .json({ status: 404, success: false, message: "Account not found" });
            }

            const role = await RoleSchema.findOne({ role_name });
            if (!role) {
                return res
                    .status(400)
                    .json({ status: 400, success: false, message: "Invalid role name" });
            }

            let user = await UserSchema.findOne({ email });
            if (!user) {
                const tempPassword = uuidv4();
                user = await UserSchema.create({
                    email,
                    password: await bcrypt.hash(tempPassword, 10),
                    created_by: { email: req.user.user_id?.email },
                });
            }

            const existingMember = await AccountMemeberModel.findOne({
                account_id: account._id,
                user_id: user._id,
            });
            if (existingMember) {
                return res
                    .status(400)
                    .json({ status: 400, success: false, message: "Already invited" });
            }

            const newMember = await AccountMemeberModel.create({
                account_id: account._id,
                user_id: user._id,
                role_id: role._id,
                created_by: { email: req.user.user_id?.email },
            });

            return res
                .status(201)
                .json({
                    status: 201,
                    success: true,
                    message: "user invited successfully",
                    data: newMember,
                });
        } catch (error) {
            console.log("Error@inviteMember", error?.message);
            return res
                .status(500)
                .json({ status: 500, success: false, message: "Something went wrong" });
        }
    }

    async getAccountMembersByAccountId(req, res) {
        try {
            const { accountId } = req.params;
            const members = await AccountMemeberModel.find({ account_id: accountId })
                .populate("user_id", "email").populate("role_id", "role_name")
                .populate("account_id", "account_name")

            return res.status(200).json({ status: 200, message: "Members fetched", success: true, data: members });

        } catch (error) {
            console.log("Error@getAccountMembersByAccountId", error?.message);
            return res.status(500).json({ status: 500, success: false, message: "Something went wrong" });
        }
    }

    async deleteMembers(req, res) {
        try {
            const { accountId, memberId } = req.params;

            const deleted = await AccountMemeberModel.findOneAndDelete({
                account_id: accountId,
                _id: memberId
            });
            if (!deleted) {
                return res.status(404).json({ status: 404, success: false, message: "Member not found" });
            }
            return res.status(200).json({ status: 200, success: true, message: "Member deleted successfully" });

        } catch (error) {
            console.log("Error@deleteMembers", error?.message);
            return res.status(500).json({ status: 500, success: false, message: "Something went wrong" });
        }
    }
}

module.exports = new MemberController();
