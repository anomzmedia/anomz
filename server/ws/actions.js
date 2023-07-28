import { getUserWithToken } from "../util/getUser";

globalThis.connections = [];

const wsActions = {
    async login(socket,data){
        let token = data.token;

        if(!token) return;

        let user = await getUserWithToken(token);
        if(!user) return;

        connections.push({socket,user});
    }
};

export default wsActions;
