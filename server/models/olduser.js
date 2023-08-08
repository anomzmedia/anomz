import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    friends:[{
        type:mongoose.Types.ObjectId,
        ref:"user"
    }],
    profilePhoto:{
        type:String,
        default:"/9.png",
        required:true
    }
},{versionKey:false,timestamps:true});

const userModel = mongoose.model("user",userSchema);

export default userModel;
