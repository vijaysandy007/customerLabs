const AccountMember = require('../models/account_members');
const jsonwebtoken = require('jsonwebtoken');

const adminAuth = async (req, res, next) => {

    try {

        const token = req.cookies.customer_labs_token;
        if (!token) return res.status(401).json({ status: 401, success: false, message: "Unauthorized" });

        const payload = jsonwebtoken.verify(token, process.env.JWT_SECRET);

        if (!payload) return res.status(401).json({ status: 401, success: false, message: "Invalid token" });

        const user = await AccountMember.findOne({ user_id: payload.user_id }).populate('role_id user_id')

        if (!user) return res.status(401).json({ status: 401, success: false, message: "User not found" })

        // console.log("user", user)

        if (user.role_id?.role_name !== 'Admin') return res.status(401).json({ status: 401, success: false, message: "Unauthorized Access api's" });

        req.user = user;

        next();

    } catch (error) {
        console.log("Error@adminAuth Middleware", error?.message)
        return res.status(500).json({ status: 500, success: false, message: "Something went wrong" });
    }

}

module.exports = adminAuth