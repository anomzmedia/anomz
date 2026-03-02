import { AuthState, useAuth } from "@/store/auth";
import { ApiResponse } from "@/types/api";
import { User } from "@/types/types";
import { NextRouter, useRouter } from "next/router";

export const ifUserNotLoggedRedirectToLoginPage = (router: NextRouter, auth: AuthState) => {
    if(!auth.user) return router.push("/sign-in");
};

export const ifUserLoggedInRedirectToMainPage = (router: NextRouter, auth: AuthState) => {
    if(auth.user) return router.push("/");
};

export const getToken = () => {
    let token = localStorage.getItem("token");
    return token ?? "";
};

export const getPrivateKey = () => {
    let token = localStorage.getItem("privateKey");
    return token ?? "";
};

export const login = async(username:string,password:string) => {
    let res = await fetch("/api/auth/login",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            username,
            password
        }),
    });

    let json: ApiResponse<{user:User,token:string}> = await res.json();

    return json;
};

export const uploadPublicKey = async(username:string,token:string,publicKey:string) => {
    let res = await fetch(`/api/user/${username}/public-key`,{
        method:"PUT",
        headers:{
            "Content-Type":"application/json",
            Authorization:token
        },
        body:JSON.stringify({
            publicKey
        }),
    });

    let json: ApiResponse<string> = await res.json();

    return json;
};
