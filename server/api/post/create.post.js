import postModel from "../../models/post";
import { getUser } from "../../util/getUser";

export default defineEventHandler(async(event) => {
    let user = await getUser(event);
    if(!user) return createError({status:401,statusMessage:"Unauthorized!"});

    let {content,attachments} = await readBody(event);

    if(!content || !attachments || typeof(attachments) != "object") return {success:false,message:"Body error!"};

    if(content.length > 1024) return {success:false,message:"Maximum post size is 1024!"};

    let post = await (await postModel.create({
        author:user._id,
        attachments:[],
        content
    })).populate("author","-password");

    return {success:true,message:"Post created!",post};
});
