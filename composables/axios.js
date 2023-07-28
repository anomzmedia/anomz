import axios from "axios";

const useAPI = () => {
    axios.defaults.baseURL = "/";
    axios.defaults.headers = {authorization:useCookie("token").value,'Content-Type':'application/json'};

    return axios;
};

export default useAPI;
