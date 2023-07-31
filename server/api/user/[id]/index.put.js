import userModel from "../../../models/user";
import * as fs from "fs";
import { getUser } from "../../../util/getUser";
import {extname} from "path"
import {upload} from "../../../util/hizliresim";
import * as path from "path";
import { fileURLToPath } from "url";

export default defineEventHandler(async(event) => {
    const id = getRouterParams(event).id;
    if(!id) return {success:false,message:"Username not provided!"};

    let my = await getUser(event);

    if(!my || my._id != id) return {success:false,message:"Err!"};

    const files = await readMultipartFormData(event);
    const profilePhoto = files[0];

    const __filename = fileURLToPath(import.meta.url);

    const __dirname = path.dirname(__filename);

    let temp = path.join(__dirname, "..", "tmp");
    if(!fs.existsSync(temp)) fs.mkdirSync(temp);
    
    const filePath = path.join(temp,`${Math.floor(Math.random()*Date.now()).toString(36)}${extname(profilePhoto.filename)}`);

    fs.writeFileSync(filePath, profilePhoto.data);

    let {imageUrl} = await upload(filePath);

    fs.rmSync(filePath);

    my.profilePhoto = imageUrl;
    await my.save();

    return {success:true,imageUrl};
});
