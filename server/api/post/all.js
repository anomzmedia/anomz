import postModel from "../../models/post";
import { getUser } from "../../util/getUser";

export default defineEventHandler(async(event) => {

    let postPerPage = 10;
    
    let {page} = await getQuery(event);
    if(!page) page = 0;
    page = Number(page);
    
    let find = await postModel.find().skip(postPerPage*page).limit(postPerPage).populate("author","-password -friends").sort("-createdAt");

    return {success:true,find};
});
