import axios from "axios";
import fs from "node:fs";
import path from "path";
import FormData from "form-data";

const getCSRF = () => {
    return new Promise((resolve,reject) => {
        axios.get("https://hizliresim.com/").then((res) => {
            resolve({
                csrf:res.data.match(/<meta name="csrf-token" content="(.*)?" \/>/)[1],
                cookie: res.headers["set-cookie"]   
            })
        });
    });
}

export const upload = async (file) => {
    let {csrf,cookie} = await getCSRF();

    const data = new FormData();
    data.append("file[]", fs.createReadStream(file));

    let res = await axios.post("https://www.hizliresim.com/image-upload",data,{
        headers:{
            "Content-Type":"application/x-www-form-urlencoded",
            "x-csrf-token": csrf,
            Cookie: cookie,
        }
    });

    res = await axios.get(res.data.url,{
        headers:{
            Cookie: cookie,
        }
    });

    let code = res.data.match(/<input required="required" type="email" name="email" id="web-.*" class="input" value="https:\/\/www\.hizliresim\.com\/(.*)" onclick="this\.select\(\);">/)[1];

    return {code,imageUrl: `https://i.hizliresim.com/${code}${path.extname(file)}`}
};
