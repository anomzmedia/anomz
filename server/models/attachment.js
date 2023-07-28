import mongoose from "mongoose";

const attachmentSchema = new mongoose.Schema({
    author:{
        type: mongoose.Types.ObjectId,
        ref:"user"
    },
    content:{
        type: Buffer
    }
},{timestamps:true});

const attachmentModel = mongoose.model("attachment",attachmentSchema);

export default attachmentModel;
