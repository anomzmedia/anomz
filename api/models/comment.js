import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    author:{
        type: mongoose.Types.ObjectId,
        ref:"user"
    },
    post:{
        type: mongoose.Types.ObjectId,
        ref:"post"
    },
    content:{
        type:String
    }
},{timestamps:true,versionKey:false});

const commentModel = mongoose.model("comment",commentSchema);

export default commentModel;
