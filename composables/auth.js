import useAPI from "~/composables/axios";
import {DeleteWS} from "~/composables/socket";

export const useAuth = async () => {
    const axios = useAPI();

    const token = useCookie("token").value;
    if(!token) return null;

    let res = await axios.get('/api/auth/me');
    let data = res.data;

    if(!data.success) return null;

    useState("user").value = data.user;

    return data.user;
};

export const logout = () => {
    useCookie("token").value = null;
    useState("user").value = null;
    useRouter().push("/login");

    DeleteWS();
};
