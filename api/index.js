require('dotenv').config();
const express = require('express');
const bodyparser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const http = require('http');
const fileUpload = require('express-fileupload');
const { default: ImgurClient } = require('imgur');

const {PrismaPg} = require("@prisma/adapter-pg");
const { PrismaClient } = require("./prisma/generated");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
globalThis.prisma = new PrismaClient({ adapter });

const app = express();

app.use(fileUpload({
 useTempFiles:false,
 abortOnLimit:true,
 limits:{
    fileSize:10485760
 },
}));

const server = http.createServer(app);

const { Server } = require("socket.io");
globalThis.io = new Server(server,{
    cors:"*"
});

//globalThis.sockets = [];
globalThis.imgurClient = new ImgurClient({
    clientId: process.env.IMGUR_CLIENT_ID,
    clientSecret: process.env.IMGUT_CLIENT_SECRET,
    //refreshToken: process.env.IMGUR_REFRESH_TOKEN,
});

globalThis.sockets = {};

io.use((sock,next) => {
    let token = sock.handshake.auth?.token;
    if(!token) return next(new Error('Authentication error'));

    jwt.verify(token,process.env.SECRET,async(err,decoded) => {
        if(err) return next(new Error('Authentication error'));

        let find = await prisma.user.findFirst({
            where:{
                id: decoded.user.id,
                password: decoded.user.password
            },
        })

        if(!find) return next(new Error('Authentication error'));

        sock.user = find;
        next();
    });
}).on('connection',(sock) => {
    sockets[sock.user.id] = sock.id;

    sock.on('disconnect',() => {
        delete sockets[sock.user.id];
    });

    sock.on('ping',(callback) => {
        if(!callback || typeof(callback) != "function") return;
        callback();
    });
});

app.use(morgan('dev'));

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:false
}))

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));

app.set('trust proxy',1);

app.use(async(req,res,next) => {
    try {
        let authorization = req.headers.authorization;
        if(!authorization) return next();

        let decode = jwt.verify(authorization,process.env.SECRET);

        let find = await prisma.user.findFirst({
            where:{
                id:decode.user.id,
                password:decode.user.password
            },
        });

        if(!find) return next();

        req.user = find;

        next();
    } catch (error) {
        next();
    }
});

const auth = require('./routes/auth');
const user = require('./routes/user');
const conversation = require('./routes/conversation');
const spotify = require('./routes/spotify');

app.use('/api/auth',auth);
app.use('/api/user',user);
app.use('/api/conversation',conversation);
app.use('/api/spotify',spotify);

app.get('/api/stats',async(req,res) => {
    let users = await prisma.user.count();
    let messages = await prisma.message.count();
    res.json({users,messages});
});

/*(async() => {
    let conv = await prisma.conversation.create({
        data:{
            name:"7be1d14fb4122fcf and bac4f46ab51ef89f",
            type:"DM",
            avatar:null,
            participants:{
                create:[
                    {
                        user:{
                            connect:{
                                username:"7be1d14fb4122fcf"
                            }
                        }
                    },
                    {
                        user:{
                            connect:{
                                username:"bac4f46ab51ef89f"
                            }
                        }
                    }
                ]
            },
            messages:{
                create:{
                    content:"Conversation created...",
                    type:"SYSTEM",
                }
            }
        }
    });

    console.log(conv);
})();*/

(async() => {

    /*for (let i = 0; i < 30; i++) {
        await prisma.message.create({
            data:{
                content:`${i}`,
                conversationId:"cmlmi6hyf00000wu25ehhj0m9",
                type:"TEXT",
                senderId:"cmlmi0wdu0001cku27tubq0g0", //cmlmi0tx80000cku23ewxf8o4
            }
        })        
    }*/
})();

const PORT = process.env.PORT || 5000;
prisma.$connect().then(() => server.listen(PORT,() => console.log(`App listening on port ${PORT}`)));
