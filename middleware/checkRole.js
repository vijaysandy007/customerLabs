const AccountMember = require('../models/account_members');

function checkRole(allowedRoles = []) {
    return async (req, res, next) => {
        try {
            const accountId = req.params.accountId || req.body.account_id;
            if (!accountId) {
                return res.status(400).json({ success: false, message: "Account ID is required" });
            }

            const member = await AccountMember.findOne({
                account_id: accountId,
            }).populate('role_id');

            if (!member) {
                return res.status(403).json({ success: false, message: "Member not found" });
            }

            if (!allowedRoles.includes(member.role_id.role_name)) {
                return res.status(403).json({ status: 403, success: false, message: "Permission denied" });
            }
            next();
        } catch (error) {
            console.log("Error@checkRole Middleware", error?.message)
            return res.status(500).json({ status: 500, success: false, message: "Something went wrong" });
        }
    }
}

module.exports = checkRole;