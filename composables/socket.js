const {public:{socketLink}} = useRuntimeConfig();

export const InitWS = () => {
    const socket = useState("socket");

    if(socket.value) {
        socket.value.close();
        socket.value = null;
    };

    socket.value = new WebSocket(socketLink);

    socket.value.addEventListener('open',() => {
        console.log("connected");
        socket.value.send(JSON.stringify({
            action:"login",
            token:useCookie("token").value
        }));
    });

    socket.value.addEventListener('message',(data) => {
        console.log(data);
    });
};

export const DeleteWS = () => {
    const socket = useState("socket");

    if(!socket.value) return;

    socket.value.close();

    socket.value = null;
};
