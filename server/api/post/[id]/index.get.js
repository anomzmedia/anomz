import postModel from "../../../models/post";
import commentModel from "../../../models/comment";
import { getUser } from "../../../util/getUser";

export default defineEventHandler(async(event) => {
    const {id} = getRouterParams(event);

    if(!id) return {success:false,message:"Param error!"};

    let find = await postModel.findOne({_id:id}).populate("author","-password");
    if(!find) return {success:false,message:"Not found!"};

    let comments = await commentModel.find({post:find._id}).populate("author","-password").sort("-createdAt");

    return {success:true,message:"Found!",post:find,comments};
});
