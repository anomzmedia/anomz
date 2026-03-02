const express = require('express');
const auth = require('../middleware/auth');
const { messageLimiter } = require('../middleware/limiters');

const router = express.Router();

router.get("/search",async(req,res) => {
    try {
        const {q} = req.query;
        if(!q || q?.length < 5) return res.status(400).json({success:false,message:"User not found!"});

        const users = await prisma.user.findMany({
            where: {
                username: {
                    contains: q,
                    mode: 'insensitive',
                },
            },
            select: {
                id: true,
                username: true,
                avatar:true,
            },
            take: 20,
        });

        res.json({success:true,data:users});
    } catch (error) {
        res.status(500).json({success:false,message:"Server error!"});
    }
});

router.get('/:id',async(req,res) => {
    let {id} = req.params;

    let find = await prisma.user.findFirst({
        where:{
            username:id
        },
        select:{
            id:true,
            username:true,
            avatar:true,
            publicKey:true,
        }
    });

    if(!find) return res.status(400).json({success:false,message:"User not found!"});

    res.json({success:true,data:find});
});

router.get('/:id/public-key',async(req,res) => {
    let {id} = req.params;

    let find = await prisma.user.findFirst({
        where:{
            username:id
        },
        select:{
            publicKey:true
        }
    });

    if(!find) return res.status(400).json({success:false,message:"User not found!"});

    res.json({success:true,data:find.publicKey});
});

router.put('/:id/public-key',auth,async(req,res) => {
    let {id} = req.params;

    let find = await prisma.user.findFirst({
        where:{
            username:id
        },
    });

    const {publicKey} = req.body;

    if(!find || id != req?.user?.username) return res.status(400).json({success:false,message:"User not found!"});

    find = await prisma.user.update({
        where:{
            id:find.id
        },
        data:{
            publicKey
        }
    });

    res.json({success:true,data:find.publicKey});
});

module.exports = router;
