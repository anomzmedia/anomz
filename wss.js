import crypto from "node:crypto";
import {WebSocketServer} from 'ws';
import wsActions from './server/ws/actions';

globalThis.connections = [];

const wss = new WebSocketServer({
    port: 8080
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
