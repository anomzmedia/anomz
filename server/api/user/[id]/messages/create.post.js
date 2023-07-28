import messageModel from "../../../../models/message";
import userModel from "../../../../models/user";
import { getUser } from "../../../../util/getUser";

export default defineEventHandler(async(event) => {
    const id = getRouterParams(event).id;
    if(!id) return {success:false,message:"Username not provided!"};

    const myUser = await getUser(event);
    if(!myUser) return {success:false,message:"You need login!"};

    if(myUser.username == id) return {success:false,message:"You can't send messages to yourself!"};

    const {content} = await readBody(event);
    if(!content) return {success:false,message:"Body error!"};

    let user = await userModel.findOne({username:id}).select("-password");
    if(!user) return {success:false,message:"User not found!"};

    let myMessage = await (await messageModel.create({from:myUser._id,to:user._id,content})).populate("from","-password");

    let find = connections.find((ob) => ob.user._id.toString() == user._id.toString());

    if(!find) return {success:true,message:"Find!",user,newMessage:myMessage};

    find.socket.send(JSON.stringify({
        action:"message",
        value:JSON.stringify(myMessage)
    }));

    return {success:true,message:"Find!",user,newMessage:myMessage};
});
