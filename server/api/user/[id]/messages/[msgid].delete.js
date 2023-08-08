import messageModel from "../../../../models/message";
import userModel from "../../../../models/user";
import { getUser } from "../../../../util/getUser";

export default defineEventHandler(async(event) => {
    const {id,msgid} = getRouterParams(event);
    if(!id || msgid) return {success:false,message:"Id not provided!"};

    const myUser = await getUser(event);
    if(!myUser) return {success:false,message:"You need login!"};

    let user = await userModel.findOne({id}).select("-password -friends");
    if(!user) return {success:false,message:"Not found!"};

    let message = await messageModel.findOne({from:myUser._id,to:user._id,_id:msgid});

    if(!message) return {success:false,message:"Not found!"};

    await message.deleteOne();

    let find = connections.find((ob) => ob.user._id.toString() == user._id.toString());

    if(find) find.socket.send(JSON.stringify({
        action:"messageDelete",
        value:JSON.stringify(message)
    }));

    return {success:true,message:"Message deleted!"};
});
