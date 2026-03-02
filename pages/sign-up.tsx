import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import { CheckCircle, Copy, Download, Eye, Key, LogIn } from "lucide-react";
import { ApiResponse } from "@/types/api";
import Confetti from 'react-confetti';
import Button from "@/components/ui/Button";
import Tooltip from "@/components/ui/tooltip/Tooltip";
import TooltipHeader from "@/components/ui/tooltip/TooltipHeader";
import TooltipContent from "@/components/ui/tooltip/TooltipContent";
import { generateKeyPair } from "@/lib/key";
import { login, uploadPublicKey } from "@/lib/auth";
import { User } from "@/types/types";

export default function SignUp() {
    const router = useRouter();

    const [loading,setLoading] = useState<boolean>(false);
    const [error,setError] = useState<string|null>(null);
    /*const [result,setResult] = useState<any|null>({
        id: "698785be286849475a907559",
        password: "3c96236c067718071228fa0aa5b7dc1c",
        username: "18083f1a90b35011",
    });*/
    const [result,setResult] = useState<any|null>(null);

    const [showPassword,setShowPassword] = useState<boolean>(false);

    const [privateKey,setPrivateKey] = useState<string>("");
    const [publicKey,setPublicKey] = useState<string>("");

    const generate = async() => {
        setLoading(!loading);

        try {
            let res = await fetch("/api/auth/register",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                }
            });

            let json: ApiResponse<User> = await res.json();

            if(!json.success || !json.data) throw Error(json.message);

            let {publicKey,privateKey} = await generateKeyPair();
            setPublicKey(publicKey);
            setPrivateKey(privateKey);

            let {data} = await login(json.data?.username,json.data?.password);
            if(!data?.user) return;

            await uploadPublicKey(data?.user.username,data?.token,publicKey);

            setResult(json.data);
        } catch (error) {
            console.log(error);
        }
    };

    const download = () => {
        let blob = new Blob([JSON.stringify(result)]);
        let url = URL.createObjectURL(blob);

        let a = document.createElement("a");
        a.href = url;
        a.target = "_blank";
        a.download = `anomz_${result.username}_user_credentials.json`;
        a.click();
    };

    const downloadPrivateKey = () => {
        let blob = new Blob([privateKey]);
        let url = URL.createObjectURL(blob);

        let a = document.createElement("a");
        a.href = url;
        a.target = "_blank";
        a.download = `anomz_${result.username}_user_private_key.key`;
        a.click();
    };

    const copy = (text:string) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <div className="w-full h-auto overflow-auto">
            <div className="w-full h-auto flex flex-col items-center mt-32 mb-4">
                <div className="lg:w-2/3 w-full h-auto flex flex-col items-center gap-5">
                    {
                        result ? <>
                            <div className="py-4 px-4 bg-gray-800 border-2 border-gray-700 w-full rounded flex flex-col items-start gap-5">
                                <span className="text-2xl font-semibold">Your account generated</span>
                                <div className="flex flex-row items-center gap-3">
                                    <span>Id: {result.id}</span>
                                    <Tooltip clickText={<span>Clicked!</span>}>
                                        <TooltipHeader>
                                            <span>Click For Copy</span>
                                        </TooltipHeader>
                                        <TooltipContent>
                                            <Copy className="cursor-pointer" onClick={() => copy(result.id)} size={16}/>
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                                <div className="flex flex-row items-center gap-3">
                                    <span>Username: <span className="font-semibold">{result.username}</span></span>
                                    <Tooltip clickText={<span>Clicked!</span>}>
                                        <TooltipHeader>
                                            <span>Click For Copy</span>
                                        </TooltipHeader>
                                        <TooltipContent>
                                            <Copy className="cursor-pointer" onClick={() => copy(result.username)} size={16}/>
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                                <div className="flex flex-row items-center gap-1">
                                    <span>Password:</span>
                                    <div className="relative mr-2">
                                        <span className="font-semibold">{result.password}</span>
                                        <div className={`absolute w-full h-full bg-black/30 backdrop-blur-sm top-0 left-0 z-10 rounded duration-100 ${!showPassword ? "opacity-100 visible" : "opacity-0 invisible"}`}></div>
                                    </div>
                                    <Eye onClick={() => setShowPassword(!showPassword)} className="cursor-pointer mr-2" size={16}/>
                                    <Tooltip clickText={<span>Clicked!</span>}>
                                        <TooltipHeader>
                                            <span>Click For Copy</span>
                                        </TooltipHeader>
                                        <TooltipContent>
                                            <Copy className="cursor-pointer" onClick={() => copy(result.password)} size={16}/>
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                                <div className="flex flex-row items-center gap-3">
                                    <Button onClick={downloadPrivateKey} className="gap-3" style="green"><Key size={16}/>Download Private Key</Button>
                                    <Button onClick={download} className="gap-3" style="green"><Download size={16}/>Download Account Info</Button>
                                    <Link href={"/sign-in"}>
                                        <Button style="blue" className="gap-3"><LogIn size={16}/> Login</Button>
                                    </Link>
                                </div>
                            </div>
                        </> : <>
                            <Button onClick={generate} loading={loading}>Generate a New Account</Button>
                            <Link href={"/sign-in"} className="text-blue-600 underline">Sign In</Link>
                            {
                                error && <div className="py-2 px-4 bg-red-100 text-red-600 rounded">
                                    <span>{error}</span>
                                </div>
                            }
                        </>
                    }
                </div>
            </div>
        </div>
    );
}
