const RoleSchema = require("../models/role");

const createRole = async() =>{
    try {
        const isRoleExit = await RoleSchema.findOne({});

        if(!isRoleExit){
            const roles = ['Admin', 'Normal user']
            for(let r of roles){
                const role = new RoleSchema({
                    role_name: r
                })
                await role.save();
            }
            console.log("Role created...")
        }
        
    } catch (error) {
        console.log("Error@createRole",error?.message)
    }
}
module.exports = createRole;