import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    author:{
        type: mongoose.Types.ObjectId,
        ref:"user"
    },
    content:{
        type:String
    },
    attachments:[{
        type: mongoose.Types.ObjectId,
        ref:"attachment"
    }],
    tags:[{
        type: mongoose.Types.ObjectId,
        ref:"tag"
    }]
},{timestamps:true});

const postModel = mongoose.model("post",postSchema);

export default postModel;
