const UserModel = require('../models/user');
const jsonwebtoken = require('jsonwebtoken');

const auth = async(req, res,next)=>{
    try {
        const token = req?.cookies?.customer_labs_token;
        if(!token){
            return res.status(401).json({status:401, success: false, message: "Unauthorized" });
        }
        const payload = jsonwebtoken.verify(token, process.env.JWT_SECRET);
        if(!payload){
            return res.status(401).json({status:401, success: false, message: "Invalid token" });
        }
        const user = await UserModel.findOne({_id:payload.user_id})
        if(!user){
            return res.status(401).json({status:401, success: false, message: "User not found" });
        }
        req.user = user;
        next();
        
    } catch (error) {
        console.log("Error@auth Middleware",error?.message)
        return res.status(500).json({status:500, success: false, message: "Something went wrong" });
    }

}

module.exports = auth