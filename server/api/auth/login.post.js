import userModel from "../../models/user";
import jwt from "jsonwebtoken";

export default defineEventHandler(async(event) => {
    const config = useRuntimeConfig();

    try {
        let body = await readBody(event);

        let {id,password} = body;
        if(!id || !password) return {success:false,message:"Body error!"};
    
        let user = await userModel.findOne({id,password});
        
        if(!user) return {success:false,message:"Incorrect id or password!"};

        let token = jwt.sign({user,expiresIn:(Date.now()+(30*24*60*60*1000))},config.SECRET);

        return {success:true,user,token};
    } catch (error) {
        return {success:false,message:error.message};
    }
});
