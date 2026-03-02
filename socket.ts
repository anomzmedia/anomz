import { io, Socket } from "socket.io-client";

const isBrowser = typeof window !== "undefined";
let socket: Socket | null = null;

export const getSocket = () => {
    if (!isBrowser) return null;
    
    if (!socket) {
        socket = io("http://localhost:5000", {
            auth: {
                token: localStorage.getItem("token")
            }
        });
    }
    
    return socket;
};

export const reconnectSocket = () => {
    if (socket) {
        socket.disconnect();
    };

    socket = io("http://localhost:5000", {
        auth: {
            token: localStorage.getItem("token")
        }
    });
    
    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};
