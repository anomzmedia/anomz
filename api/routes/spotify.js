const express = require('express');
const jwt = require('jsonwebtoken');
const crpyto = require('crypto');
const rateLimit = require('express-rate-limit');
const auth = require('../middleware/auth');
const argon2 = require("argon2");
const { loginBody } = require('../body/auth');
const { default: axios } = require('axios');
const fs = require("fs");

const router = express.Router();

globalThis.spotifyAccessToken = "";

let getSpotifyAccessToken = async() => {
    try {
        let get = await axios.post("https://accounts.spotify.com/api/token",{
            grant_type:"client_credentials",
            client_id:process.env.SPOTIFY_CLIENT_ID,
            client_secret:process.env.SPOTIFY_CLIENT_SECRET,
        },{
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });

        const {access_token,expires_in} = get.data;

        let expireDate = Date.now()+(expires_in*1000);

        fs.writeFileSync("spotify_credentials.json",JSON.stringify({access_token,expireDate}));

        return access_token;
    } catch (error) {
        console.log(error.response.data);
    }
};

const checkCredentials = async() => {
    if(!fs.existsSync("spotify_credentials.json")) fs.appendFileSync("spotify_credentials.json",JSON.stringify({
        access_token:"",
        expireDate:0,
    }));

    let credentials = fs.readFileSync("spotify_credentials.json","utf-8");
    credentials = JSON.parse(credentials);

    let timeout = 3600000;

    if(Date.now() > credentials.expireDate) globalThis.spotifyAccessToken = await getSpotifyAccessToken();
    else {
        globalThis.spotifyAccessToken = credentials.access_token;
        timeout = Date.now()-credentials.expireDate;
    };

    setTimeout(checkCredentials, timeout);
};

checkCredentials();

router.get("/search",async(req,res) => {
    try {
        const {q} = req.query;
        if(!q) return res.status(400).json({success:false});

        let {data} = await axios.get(`https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=track&limit=10`,{
            headers:{
                Authorization:`Bearer ${spotifyAccessToken}`,
            }
        });

        res.json({success:true,data});
    } catch (error) {
        res.status(500).json({success:false,message:"Server error!"});
    }
});

module.exports = router;
