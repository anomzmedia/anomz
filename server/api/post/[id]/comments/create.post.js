import postModel from "../../../../models/post";
import commentModel from "../../../../models/comment";
import { getUser } from "../../../../util/getUser";

export default defineEventHandler(async(event) => {
    const {id} = getRouterParams(event);
    if(!id) return {success:false,message:"Param error!"};

    let myUser = await getUser(event);
    if(!myUser) return {success:false,message:"Unauthorized!"}

    const {content} = await readBody(event);
    if(!content) return {success:false,message:"Body err!"};

    if(content.length > 128) return {success:false,message:"Maximum comment length is 128"};

    let find = await postModel.findOne({_id:id});
    if(!find) return {success:false,message:"Post not found!"};

    let comment = await commentModel.create({post:find._id,content,author:myUser._id});

    return {success:true,message:"Created!",post:find,comment};
});
