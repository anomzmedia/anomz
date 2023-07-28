import mongoose from "mongoose";

const tagSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
},{versionKey:false,timestamps:true});

const tagModel = mongoose.model("tag",tagSchema);

export default tagModel;
