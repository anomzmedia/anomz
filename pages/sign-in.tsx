import { useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/ui/Input";
import FormField from "@/components/ui/FormField";
import Button from "@/components/ui/Button";
import Link from "next/link";
import Tooltip from "@/components/ui/tooltip/Tooltip";
import TooltipHeader from "@/components/ui/tooltip/TooltipHeader";
import TooltipContent from "@/components/ui/tooltip/TooltipContent";
import { LogIn, Upload } from "lucide-react";
import { ApiResponse } from "@/types/api";
import { reconnectSocket } from "@/socket";

export default function SignUp() {
    const router = useRouter();

    const schema = z.object({
        username: z.string().min(1),
        password: z.string().min(6)
    });

    type FormSchema = z.infer<typeof schema>;

    const form = useForm<FormSchema>({
        resolver: zodResolver(schema),
        defaultValues:{
            username:"",
            password:"",
        }
    });

    const [loading,setLoading] = useState<boolean>(false);

    const login = async(data:any) => {
        let res = await fetch("/api/auth/login",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(data),
        });

        let json: ApiResponse<any> = await res.json();

        if(!json.success) throw Error(json.message);

        localStorage.setItem("token",json.data.token);
        reconnectSocket();
        //router.push("/app");
        window.location.href = "/app";

        return json.data;
    };

    const onSubmit = form.handleSubmit(async(data) => {
        setLoading(!loading);

        try {
            let json = await login(data);
            console.log(json);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    });

    const upload = () => {
        let input = document.createElement("input");
        input.type = "file";

        input.addEventListener("change",(e) => {
            let reader = new FileReader();
            let file = e.target.files[0];

            reader.readAsText(file);

            reader.onloadend = async(ev) => {
                try {
                    let res = ev.target.result;
                    res = JSON.parse(res);

                    await login({username:res.username,password:res.password});
                } catch (error) {
                    
                }
            };
        });

        input.click();
    };

    return (
        <div className="w-full h-auto overflow-auto">
            <div className="w-full h-auto flex flex-col items-center mt-32 mb-4">
                <div className="lg:w-2/3 w-full h-auto flex flex-col items-center gap-5">
                    <div className="w-full grid lg:grid-cols-2 grid-cols-1">
                        <img draggable={false} className="w-full select-none rounded-l-lg lg:block hidden" src="/login.jpg" alt="" />
                        <form className="flex flex-col items-center justify-center gap-5 w-full bg-gray-800 h-full p-6 rounded-r-lg" onSubmit={onSubmit}>
                            <span className="text-2xl font-semibold">Sign In</span>
                            <FormField className="lg:w-1/2 w-full">
                                <label className="font-semibold" htmlFor="username">Username</label>
                                <Input className="w-full" id="username" type="text" placeholder="Username" error={form.formState.errors.username} {...form.register("username")} />
                            </FormField>
                            <FormField className="lg:w-1/2 w-full">
                                <label className="font-semibold" htmlFor="password">Password</label>
                                <Input className="w-full" id="password" type="password" placeholder="Password" error={form.formState.errors.password} {...form.register("password")} />
                            </FormField>
                            <Button disabled={loading} className="lg:w-1/2 w-full justify-between" loading={loading} type="submit">Sign In <LogIn size={16}/> </Button>
                            <Button disabled={loading} style={"green"} className="lg:w-1/2 w-full justify-between" loading={loading} onClick={upload} type="button">Upload Credentials <Upload size={16}/> </Button>
                            <div className="lg:w-1/2 w-full">
                                <Link href={"/sign-up"} className="text-blue-600 underline">Sign Up</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
