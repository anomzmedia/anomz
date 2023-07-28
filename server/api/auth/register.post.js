import userModel from "../../models/user";

export default defineEventHandler(async(event) => {
    try {
        let body = await readBody(event);

        let {username,password} = body;
        if(!username || !password) return {success:false,message:"Body error!"};

        if(password.length < 6) return {success:false,message:"Minumum password length is 6!"};
    
        let user = await userModel.create({username,password});
    
        return {success:true,user};
    } catch (error) {
        if(error.code == 11000) return {success:false,message:"User already exist!"};
        return {success:false,message:error.message};
    }
});
