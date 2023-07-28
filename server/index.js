import mongoose from "mongoose";
import {WebSocketServer} from 'ws';
import wsActions from "./ws/actions";
import crypto from "node:crypto";
import postModel from "./models/post";
import {upload} from "./util/hizliresim";

const config = useRuntimeConfig();

export default async () => {
    await mongoose.connect(config.mongoURL);

    console.log("Mongo connected!");

    const wss = new WebSocketServer({
        port: Number(config.webSocketPort)
    });

    wss.on('connection',(socket) => {
        socket.uuid = crypto.randomUUID();

        socket.on('message',(data) => {
            try {
                data = JSON.parse(data);
                if(!data.action) return;

                if(!wsActions[data.action]) return;
    
                wsActions[data.action](socket, data);
            } catch (error) {
                
            }
        });

        socket.on('close',() => {
            globalThis.connections = globalThis.connections.filter((ob) => ob.socket.uuid != socket.uuid);
        })
    });
    
    wss.on('listening',() => {
        console.log("WebSocket server is listening!");
    });    
};
