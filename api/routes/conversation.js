const express = require('express');
const auth = require('../middleware/auth');
const { messageLimiter } = require('../middleware/limiters');
const { createMessageBody } = require('../body/message');
const { createConversationKeys } = require('../body/auth');

const router = express.Router();

router.get('/',auth,async(req,res) => {
    try {
        const data = await prisma.conversation.findMany({
            where:{
                participants:{
                    some:{
                        userId:req.user.id
                    }
                },
            },
            include:{
                participants:{
                    include:{
                        user:{
                            select:{
                                id:true,
                                username:true,
                                avatar:true,
                            }
                        }                        
                    }
                },
                messages:{
                    take:1,
                    orderBy:{createdAt:"desc"},
                    include:{
                        sender:{
                            select:{
                                id:true,
                                username:true,
                                avatar:true,
                            }
                        }
                    }
                }
            },
            orderBy:{
                updatedAt:"desc"
            }
        });

        res.json({success:true,data});
    } catch (error) {
        res.status(500).json({success:false,message:"Internal server error."});
    }
});

router.post("/create",async(req,res) => {
    try {

    } catch (error) {
        
    }
});

router.post("/user/:id",auth,async(req,res) => {
    
    try {
        const body = await createConversationKeys.validateAsync(req.body);

        const {id} = req.params;

        let user = await prisma.user.findFirst({
            where:{
                username:id
            }
        });

        if(!user) return res.status(400).json({success:false,message:"Not found user!"});

        let conversation = await prisma.conversation.findFirst({
            where:{
                type:'DM',
                AND:[
                    {
                        participants:{
                            some:{
                                user:{id:user.id}
                            }
                        }
                    },
                    {
                        participants:{
                            some:{
                                user:{id:req.user.id}
                            }
                        }
                    }
                ]
            }
        });

        if(!conversation) {
            conversation = await prisma.conversation.create({
                data:{
                    type:"DM",
                    name:`${req.user.username} and ${user.username} DM`,
                    participants:{
                        create:[
                            {userId:req.user.id},
                            {userId:user.id}
                        ]
                    },
                    messages:{
                        create:{
                            content:`Start of DM ${req.user.username} and ${user.username}`,
                        }
                    },
                    encryptedKeys:{
                        create:body
                    },
                    creatorId:req.user.id
                }
            });
        }

        res.json({success:true,data:conversation});
    } catch (error) {
        res.status(500).json({success:false,message:"Internal server error."});
    }
});

router.get('/:id',auth,async(req,res) => {
    try {
        const {id} = req.params;

        const data = await prisma.conversation.findFirst({
            where:{
                id,
                participants:{
                    some:{
                        userId:req.user.id
                    }
                }
            },
            include:{
                participants:{
                    select:{
                        role:true,
                        joinedAt:true,
                        user:{
                            select:{
                                id:true,
                                username:true,
                                avatar:true,
                            }
                        }
                    }
                }
            }
        });

        if(!data) return res.status(400).json({success:false,message:"Not found!"});

        res.json({success:true,data});
    } catch (error) {
        res.status(500).json({success:false,message:"Internal server error."});
    }
});

router.get('/:id/keys',auth,async(req,res) => {
    try {
        const {id} = req.params;

        const data = await prisma.conversationKey.findMany({
            where:{
                conversationId:id,
                conversation:{
                    participants:{
                        some:{
                            userId:req.user.id
                        }
                    }
                }
            },
        });

        res.json({success:true,data});
    } catch (error) {
        res.status(500).json({success:false,message:"Internal server error."});
    }
});

router.get('/:id/public-keys',auth,async(req,res) => {
    try {
        const {id} = req.params;

        const conversation = await prisma.conversation.findFirst({
            where:{
                id,
            },
            include:{
                participants:{
                    select:{
                        user:{
                            select:{
                                id:true,
                                username:true,
                                publicKey:true,
                            }
                        }
                    }
                }
            }
        });

        if(!conversation || !conversation.participants.find((e) => e.user.id == req.user.id)) return res.status(400).json({success:false,message:"Not found conversation!"});;

        res.json({success:true,data:conversation.participants.map((e) => e.user)});
    } catch (error) {
        res.status(500).json({success:false,message:"Internal server error."});
    }
});

router.get('/:id/messages',auth,async(req,res) => {
    try {
        const {id} = req.params;

        const data = await prisma.message.findMany({
            where:{
                conversationId:id,
                conversation:{
                    participants:{
                        some:{
                            userId:req.user.id
                        }
                    }
                }
            },
            orderBy:{
                createdAt:"desc"
            },
            take:10000,
            include:{
                sender:{
                    select:{
                        id:true,
                        username:true,
                        avatar:true,
                    }
                }
            }
        });

        res.json({success:true,data});
    } catch (error) {
        res.status(500).json({success:false,message:"Internal server error."});
    }
});

router.post('/:id/messages/create',auth,async(req,res) => {
    try {
        const {id} = req.params;

        const {content,iv} = await createMessageBody.validateAsync(req.body);

        const conversation = await prisma.conversation.findFirst({
            where:{
                id,
                participants:{
                    some:{
                        userId:req.user.id
                    }
                },
            },
            include:{
                participants:{
                    select:{
                        user:{
                            select:{
                                id:true,
                                username:true,
                                avatar:true,
                            }
                        }
                    }
                }
            }
        });

        if(!conversation) return res.status(400).json({success:false,message:"Conversation not found!"});

        const data = await prisma.message.create({
            data:{
                content,
                iv,
                conversationId:id,
                senderId:req.user.id,
                type:"TEXT",
            },
            include:{
                sender:{
                    select:{
                        id:true,
                        username:true,
                        avatar:true,
                    }                    
                }
            }
        });

        conversation.participants.forEach((participant) => {
            io.sockets.sockets.get(sockets[participant.user.id])?.emit("message",{
                conversation:{
                    id:conversation.id,
                    name:conversation.name,
                    type:conversation.type,
                    participants:conversation.participants,
                },
                data,
            });
        });

        res.json({success:true,data});
    } catch (error) {
        res.status(500).json({success:false,message:"Internal server error."});
    }
});

module.exports = router;
