const express = require('express');
const jwt = require('jsonwebtoken');
const crpyto = require('crypto');
const rateLimit = require('express-rate-limit');
const auth = require('../middleware/auth');
const argon2 = require("argon2");
const { loginBody } = require('../body/auth');

const router = express.Router();

const limiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000,
    max: 2,
    standardHeaders: true,
    legacyHeaders: false,
    requestWasSuccessful: (req,res) => res.statusCode < 400,
    skipFailedRequests: true,
    message:{success:false,message:"You can create a maximum of 2 user in 1 day."},
});

router.post('/register',limiter,async(req,res) => {
    const username = crpyto.randomBytes(8).toString('hex');
    const password = crpyto.randomBytes(16).toString('hex');

    const hash = await argon2.hash(password);

    try {
        let user = await prisma.user.create({
            data:{
                username,
                password:hash,
            },
        });

        user.password = password;
    
        res.status(201).json({success:true,message:"Created!",data:user});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
});

router.post('/login',async(req,res) => {
    try {
        const {username,password} = await loginBody.validateAsync(req.body);
    
        let user = await prisma.user.findFirst({
            where:{
                username,
            },
        });

        if(!user) return res.status(400).json({success:false,message:"Invalid credentials!"});

        let validate = await argon2.verify(user.password,password);
        if(!validate) return res.status(400).json({success:false,message:"Invalid credentials!"});
    
        let token = jwt.sign({
            user,
        },process.env.SECRET,{
            expiresIn:"30d"
        });

        res.status(200).json({success:true,message:"Login!",user,data:{user,token}});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
});

router.get('/me',auth,(req,res) => {
    res.json({success:true,message:"Success!",user:req.user});
});

router.post('/reset',auth,async(req,res) => {
    const password = crpyto.randomBytes(16).toString('hex');

    await prisma.user.update({
        where:{
            id:req.user.id
        },
        data:{
            password
        }
    });

    res.json({success:true,message:"Success!",password});
});

module.exports = router;
