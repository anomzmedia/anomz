import userModel from "../../models/user";
import jwt from "jsonwebtoken";
import { getUser } from "../../util/getUser";

export default defineEventHandler(async(event) => {
    const user = await getUser(event);

    if(!user) return {success:false,message:"Not found!"};
    
    return {success:true,user};
});
