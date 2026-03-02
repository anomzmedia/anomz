import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { getToken } from "@/lib/auth";
import { getConversationName } from "@/lib/conversation";
import { prettyDate } from "@/lib/date";
import { useAuth } from "@/store/auth";
import { ApiResponse } from "@/types/api";
import { Conversation, Message } from "@/types/types";
import { BarChart, BarrelIcon, Fingerprint, Lock, Menu, Send, ShoppingCart, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { KeyboardEventHandler, ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";
import { getSocket } from "@/socket";
import { useAutoAnimate } from '@formkit/auto-animate/react';
import autoAnimate from "@formkit/auto-animate";
import { decryptWithAES, decryptWithRSA, encryptWithAES, generateConversationFingerprint, getConversationAES, getConversationMembersPublicKey } from "@/lib/key";
import Hr from "@/components/general/Hr";

export default function ConversationId() {
    const socket = getSocket();
    const auth = useAuth();
    const router = useRouter();

    let { id } = router.query;

    const messagesDiv = useRef<HTMLDivElement>(null);

    const [conversation,setConversation] = useState<Conversation|null>(null);
    const [messages,setMessages] = useState<Message[]>([]);

    const [message,setMessage] = useState<string>("");

    const [aesKey,setAesKey] = useState<CryptoKey|null>(null);
    const [fingerPrint,setFingerPrint] = useState<string>("");

    const scrollTopMessages = () => {
        setTimeout(() => {
            if(!messagesDiv.current) return;

            messagesDiv?.current.scrollTo({
                top:messagesDiv.current?.scrollHeight
            });
        }, 1);
    };

    useEffect(() => {
        if(!id) return;
        id = id.toString();

        (async() => {
            const token = getToken();
    
            let res = await fetch(`/api/conversation/${id}/messages`,{
                headers:{
                    Authorization:token,
                }
            });
    
            let json:ApiResponse<Message[]> = await res.json();
    
            if(!json.data) return router.push("/app");
    
            const privateKey = localStorage.getItem("privateKey");
            if (!privateKey) return;

            const AES = await getConversationAES(id,privateKey,auth.user?.id);
            if(!AES) return;

            setAesKey(AES);

            json.data.forEach(async(msg) => {
                try {
                    msg.content = await decryptWithAES(msg.content,msg.iv,AES);
                } catch (error) {
                    console.log(error);
                }
            });

            setMessages(json.data.reverse());

            const waitForMessagesDiv = () => {
                if(!messagesDiv.current) return requestAnimationFrame(waitForMessagesDiv);
                scrollTopMessages();
            };

            waitForMessagesDiv();

            let publicKeys = await getConversationMembersPublicKey(id);
            let fingerPrint = await generateConversationFingerprint(publicKeys);
            console.log(`Conversation Fingerprint: ${fingerPrint}`);
            setFingerPrint(fingerPrint);
        })();

        (async() => {
            const token = getToken();
    
            let res = await fetch(`/api/conversation/${id}`,{
                headers:{
                    Authorization:token,
                }
            });
    
            let json:ApiResponse<Conversation> = await res.json();
    
            if(!json.data) return;

            setConversation(json.data);

            setTimeout(() => {
                messagesDiv.current && autoAnimate(messagesDiv.current);
            }, 100);
        })();

        const onMessage = async(data:{conversation:Conversation,data:Message}) => {
            if(data.conversation.id != id) return;

            setAesKey((aes) => {
                if(!aes) return aes;

                (async() => {
                    const content = await decryptWithAES(data.data.content,data.data.iv,aes);

                    data.data.content = content;

                    setMessages((prevMessages) => [...prevMessages,data.data]);
                    if(Math.abs(messagesDiv.current?.scrollHeight-messagesDiv.current?.clientHeight-messagesDiv.current?.scrollTop) < 10){
                        setTimeout(() => {
                            scrollTopMessages();
                        }, 0);
                    };
                })();

                return aes;
            });

            /*let audio = document.createElement("audio");
            audio.src = "/notification.mp3";
            audio.play();*/
        };

        socket?.on("message",onMessage);

        return () => {
            socket?.off("message",onMessage);
        };
    },[]);

    const createMessage = async() => {
        if(!message) return;

        try {
            if(!aesKey) return;

            let {content,iv} = await encryptWithAES(message,aesKey);

            const token = getToken();
    
            let res = await fetch(`/api/conversation/${id}/messages/create`,{
                headers:{
                    Authorization:token,
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    content,
                    iv
                }),
                method:"POST",
            });
    
            let json:ApiResponse<Message> = await res.json();
    
            if(!json.data || !json.success) return;
                        
            //setMessages([...messages,json.data]);

            setMessage("");

            if(Math.abs(messagesDiv.current?.scrollHeight-messagesDiv.current?.clientHeight-messagesDiv.current?.scrollTop) < 10){
                setTimeout(() => {
                    scrollTopMessages();
                }, 0);
            };
        } catch (error) {
            console.log(error);
        }
    };

    const keydown:KeyboardEventHandler<HTMLTextAreaElement> = (ev) => {
        if(ev.key == "Enter" && !ev.ctrlKey){
            ev.preventDefault();
            createMessage();
        };

        if(ev.key == "Enter" && ev.ctrlKey){
            ev.preventDefault();
            const textarea = ev.currentTarget;

            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            
            const newText = message.substring(0, start) + '\n' + message.substring(end);
            setMessage(newText);
            
            setTimeout(() => {
                textarea.selectionStart = textarea.selectionEnd = start + 1;
            }, 0);
        };
    };

    useEffect(() => {
        messagesDiv.current && autoAnimate(messagesDiv.current);
    },[messagesDiv]);

    const [conversationMenu,setConversationMenu] = useState<boolean>(false);

    if(!conversation) return (<></>);

    return (
        <div className="w-full flex flex-col items-start gap-3 h-screen p-4">
            <div onClick={() => setConversationMenu(!conversationMenu)} className="cursor-pointer w-full py-2 px-4 bg-gray-800/70 border-2 border-gray-700 backdrop-blur-sm rounded-full flex flex-row items-center justify-between gap-3 shadow">
                <div className="flex flex-row items-center gap-3">
                    <img src="/anomz.png" width={32} draggable={false} alt="" />
                    <span className="font-semibold">{getConversationName(auth.user,conversation)}</span>
                </div>
                <div>
                    <Menu className="cursor-pointer" size={32}/>
                </div>
            </div>
            <div className="flex-1 flex flex-col w-full bg-gray-700 rounded-lg mb-3 py-4 px-4 gap-5 relative overflow-clip">
                <div className={`rounded-r-lg p-4 absolute z-30 bg-gray-800 top-0 w-1/2 h-full duration-300 gap-3 ${conversationMenu ? 'visible opacity-100 right-0' : 'invisible opacity-0 -right-[100vh]'} flex flex-col items-start`}>
                    <div className="w-full flex flex-col items-center gap-3">
                        <img className="select-none" src="/anomz.png" draggable={false} width={64} alt="" />
                        <span className="text-lg font-semibold">{conversation.name}</span>
                    </div>
                    <span className="text-xs font-bold select-none text-gray-400">MEMBERS ({conversation.participants?.length})</span>
                    <div className="flex flex-col items-start gap-3 select-none font-semibold">
                        {conversation.participants?.map((par) => (
                            <div className="flex flex-row items-center gap-3">
                                <img src="/anomz.png" draggable={false} width={32} alt="" />
                                <span>{par.user?.username} - {par.role}</span>
                            </div>
                        ))}
                    </div>
                    <Hr/>
                    <span className="font-semibold">Created At: {new Date(conversation.createdAt).toLocaleDateString("en-GB",{hour:"numeric",minute:"numeric",second:"numeric"})}</span>
                    <Hr/>
                    <span>Conversation Fingerprint: <strong>{fingerPrint}</strong></span>
                    <div className="flex flex-row items-center gap-3 font-semibold">
                        <Lock className="text-green-400" size={20}/>
                        <span>End-To-End Encryption</span>
                    </div>
                    <Hr/>
                </div>
                <div ref={messagesDiv} className="flex flex-col overflow-y-scroll flex-1 gap-3" style={{
                    flexBasis:"0px"
                }}>
                    {messages.map((_, i) => (
                        <div key={_.id} className={`w-full flex flex-col ${_.sender?.id == auth.user?.id ? 'items-end' : 'items-start'}`}>
                            <div className={`${_.sender?.id == auth.user?.id ? 'bg-blue-600' : 'bg-gray-600'} py-2 px-4 rounded flex flex-col items-start`}>
                                <div className="flex flex-row items-center gap-3 mb-2">
                                    <img className="select-none" src="/anomz.png" width={32} draggable={false} alt="" />
                                    <span>{_.sender?.username || "System"}</span>
                                </div>
                                <span style={{whiteSpace:"pre-wrap"}}>{_.content}</span>
                                <span className="text-xs text-blue-300">{prettyDate(new Date(_.createdAt))}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="shadow-xl w-full bg-gray-600 rounded flex flex-row items-center gap-3 pr-6 py-2 px-4">
                    <Textarea onKeyDown={keydown} value={message} onChange={(e) => setMessage(e.target.value)} rows={1} className="w-full h-full border-0! rounded bg-transparent" placeholder="Message..."/>
                    <button onClick={createMessage}>
                        <Send className="cursor-pointer" size={24}/>
                    </button>
                </div>
                {/*<div className="w-full flex lg:flex-row flex-col lg:items-center items-start gap-3 justify-between">
                    <span>Conversation Fingerprint: <strong>{fingerPrint}</strong></span>
                    <span>{new Date(Date.now()).toLocaleDateString("tr",{
                        hour:"numeric",
                        minute:"numeric",
                        second:"numeric"
                    })}</span>
                </div>*/}
            </div>
        </div>
    );
}
