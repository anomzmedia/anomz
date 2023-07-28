import jwt from "jsonwebtoken";
import userModel from "../models/user";

export const getUser = async (event) => {
    const config = useRuntimeConfig();

    try {
        let token = await getHeader(event,"Authorization");

        if(!token) return null;

        let user = await jwt.verify(token,config.SECRET);
        user = await userModel.findOne({_id:user.user._id,password:user.user.password}).populate("friends","-password -friends");

        if(!user) return null;
        
        return user;
    } catch (error) {
        return null;
    }
};

export const getUserWithToken = async(token) => {
    const config = useRuntimeConfig();

    try {
        if(!token) return null;
        let user = await jwt.verify(token,config.SECRET);
        user = await userModel.findOne({_id:user.user._id,password:user.user.password});
        if(!user) return null;
        return user;
    } catch (error) {
        return error;
    }
};
