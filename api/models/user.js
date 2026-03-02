const mongoose = require('mongoose');

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
    profilePhoto:{
        type:String,
        default:"/9.png",
        required:true
    },
    friends:[{
        type:mongoose.Types.ObjectId,
        ref:"user"
    }],
},{versionKey:false,timestamps:true});

const userModel = mongoose.model("user",userSchema);

module.exports = userModel;
