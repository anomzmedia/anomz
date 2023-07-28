import messageModel from "../../../../models/message";
import userModel from "../../../../models/user";
import { getUser } from "../../../../util/getUser";

const messagePerPage = 20;

export default defineEventHandler(async(event) => {
    const id = getRouterParams(event).id;
    if(!id) return {success:false,message:"Username not provided!"};

    const myUser = await getUser(event);
    if(!myUser) return {success:false,message:"You need login!"};

    if(myUser.username == id) return {success:false,message:"Select other user!"};

    let user = {...await userModel.findOne({username:id}).select("-password")}._doc;
    if(!user) return {success:false,message:"Not found!"};

    let {page} = await getQuery(event);
    if(!page) page = 0;
    page = Number(page);

    let findUserSocket = await connections.find((socket) => socket.user._id.toString() == user._id.toString());

    if(findUserSocket) user.active = true;
    else user.active = false;

    let myMessages = await messageModel.find({from:myUser._id,to:user._id}).populate("from","-password").populate("to","-password").sort("-createdAt");
    let itMessages = await messageModel.find({from:user._id,to:myUser._id}).populate("from","-password").populate("to","-password").sort("-createdAt");

    let messages = myMessages.concat(itMessages);

    messages = messages.slice(page*messagePerPage,(page*messagePerPage)+messagePerPage);

    messages = messages.sort((a,b) => a.createdAt-b.createdAt);
    
    messages.forEach((msg) => {msg.ogp = []});

    return {success:true,message:"Find!",user,messages};
});
