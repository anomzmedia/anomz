import userModel from "../../../models/user";
import {writeFileSync, rmSync} from "fs";
import { getUser } from "../../../util/getUser";
import {extname} from "path"
import {upload} from "../../../util/hizliresim";

export default defineEventHandler(async(event) => {
    const id = getRouterParams(event).id;
    if(!id) return {success:false,message:"Username not provided!"};

    let my = await getUser(event);

    if(!my || my._id != id) return {success:false,message:"Err!"};

    const files = await readMultipartFormData(event);
    const profilePhoto = files[0];

    const filePath = `server/temp/${Math.floor(Math.random()*Date.now()).toString(36)}${extname(profilePhoto.filename)}`;

    writeFileSync(filePath,profilePhoto.data);

    let {imageUrl} = await upload(filePath);

    rmSync(filePath);

    my.profilePhoto = imageUrl;
    await my.save();

    return {success:true,imageUrl};
});
