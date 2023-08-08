import userModel from "../../models/user";
import * as crypto from "node:crypto";

export default defineEventHandler(async(event) => {
    try {
        let id = Math.floor(Math.random()*9999999999999999).toString();
        let password = crypto.randomBytes(32).toString('hex');

        let user = await userModel.create({id,password});
    
        return {success:true,user};
    } catch (error) {
        if(error.code == 11000) return {success:false,message:"User already exist!"};
        return {success:false,message:error.message};
    }
});
