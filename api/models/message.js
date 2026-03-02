import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    from:{
        type: mongoose.Types.ObjectId,
        ref:"user"
    },
    to:{
        type: mongoose.Types.ObjectId,
        ref:"user"
    },
    content:{
        type:String
    }
},{timestamps:true});

const messageModel = mongoose.model("message",messageSchema);

export default messageModel;
