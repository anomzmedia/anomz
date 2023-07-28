import userModel from "../../../models/user";
import { getUser } from "../../../util/getUser";

export default defineEventHandler(async(event) => {
    const id = getRouterParams(event).id;
    if(!id) return {success:false,message:"Username not provided!"};

    let user = await userModel.findOne({username:id}).select("-password");
    if(!user) return {success:false,message:"Not found!"};

    let my = await getUser(event);

    if(my && my._id != user._id){
        my.friends = my.friends.filter((e) => e._id.toString() != user._id.toString());
        my.friends.unshift(user._id);
        my.save();
    }

    return {success:true,message:"Find!",user};
});
