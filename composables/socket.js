const initIO = () => {
    const {public:{apiUrl}} = useRuntimeConfig();
    
    const sock = useState("sock");
    const token = useCookie("token");

    sock.value = io(apiUrl,{
        auth:{
            token:token.value
        }
    });
    //sock.value.emit("login",token.value);
};

const closeIO = () => {
    const sock = useState("sock");
    
    sock.value.close();
};

export {initIO,closeIO};
