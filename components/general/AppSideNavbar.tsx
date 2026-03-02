import { ArrowRight, Github, MessageCircle, MoveRight, PillBottle, Settings } from "lucide-react";
import Button from "../ui/Button";
import { Conversation, User } from "@/types/types";
import { useAuth } from "@/store/auth";
import Link from "next/link";
import { getConversationName } from "@/lib/conversation";
import Hr from "./Hr";
import Input from "../ui/Input";
import { useEffect, useRef, useState } from "react";
import Modal from "../ui/Modal";
import { ApiResponse } from "@/types/api";
import { useRouter } from "next/router";
import { getPrivateKey, getToken } from "@/lib/auth";
import { encryptWithRSA, fetchUser, fetchUserPublicKey } from "@/lib/key";

export default function AppSideNavbar({conservations}:{conservations:Conversation[]}) {
    const auth = useAuth();

    const [searchModal,setSearchModal] = useState<boolean>(false);
    const searchModalRef = useRef<boolean>(searchModal);

    const [search,setSearch] = useState<string>("");
    const [searchResult,setSearchResult] = useState<User[]>([]);

    const router = useRouter();

    useEffect(() => {
        if(!search) return;

        (async() => {
            let res = await fetch(`/api/user/search?q=${search}`);
            let json:ApiResponse<User[]> = await res.json();

            if(!json.data) return setSearchResult([]);

            setSearchResult(json?.data);
        })();
    },[search]);

    useEffect(() => {
        searchModalRef.current = searchModal;
    }, [searchModal]);

    useEffect(() => {
        const checkShortucts = (e:KeyboardEvent) => {
            if(e.key === "k" && e.ctrlKey){
                e.preventDefault();
                setSearchModal((t) => !t);
            };

            if(e.key === "Escape" && searchModalRef.current){
                setSearchModal(false);
            };
        };

        window.addEventListener("keydown",checkShortucts);

        return () => window.removeEventListener("keydown",checkShortucts);
    },[]);

    const chat = async(username:string) => {
        console.log(username)
        try {
            const user = await fetchUser(username);
            const participants:User[] = [auth.user,user];

            const aesKey = await window.crypto.subtle.generateKey(
                { name: "AES-GCM", length: 256 },
                true,
                ["encrypt", "decrypt"]
            );

            const rawAesKey = await window.crypto.subtle.exportKey("raw", aesKey);

            const encryptedKeys = await Promise.all(participants.map(async (pk) => {
                const encryptedAesKey = await encryptWithRSA(rawAesKey, pk.publicKey);
                return {
                    userId: pk.id,
                    encryptedAesKey,
                };
            }));

            const token = getToken();

            let res = await fetch(`/api/conversation/user/${username}`,{
                method:"POST",
                body:JSON.stringify(encryptedKeys),
                headers:{
                    Authorization:token,
                    "Content-Type":"application/json"
                },
            });
            let json:ApiResponse<Conversation> = await res.json();

            console.log(json);
        } catch (error) {
            console.log(error);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("privateKey");
        router.push("/sign-in");
    };

    return (
        <div className="w-1/6 bg-gray-800 h-screen flex flex-col items-start justify-between gap-3 overflow-auto py-4 px-4">
            <Modal title="Search" className="flex-1 min-h-0 overflow-auto w-full py-2 px-4 flex flex-col items-center gap-3 pt-12" open={searchModal} onClose={() => setSearchModal(false)}>
                <Input value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-full" placeholder="Username"/>
                {searchResult.length == 0 ? (<span className="text-gray-400 font-semibold select-none">Not Found</span>) : (<></>)}
                {searchResult.map((_) => (
                    <div className="select-none w-full py-2 px-4 bg-gray-800 duration-300 font-semibold rounded flex flex-row items-center gap-3">
                        <img src="/anomz.png" width={32} draggable={false} alt="" />
                        <span>{_.username}</span>
                        <Button onClick={() => chat(_.username)} className="gap-3">Chat <MessageCircle size={16}/> </Button>
                    </div>
                ))}
            </Modal>
            <div className="flex flex-col items-start w-full gap-3">
                <div className="flex flex-col gap-3 items-center justify-center w-full select-none">
                    <img src="/anomz.png" width={64} alt="" draggable={false} />
                    <Link className="text-lg font-semibold" href={"/app"}>Anomz</Link>
                </div>
                <div onClick={() => setSearchModal(true)} className="border-2 border-gray-700 w-full rounded-full relative cursor-pointer">
                    <Input className="w-full h-full bg-transparent rounded-full border-0! outline-0! cursor-pointer" readOnly placeholder="Username"/>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-row items-center gap-1 select-none sepia">
                        <div className="py-1 px-2 bg-gray-600 rounded-full text-xs text-gray-300">
                            <span>CTRL</span>
                        </div>
                        <div className="py-1 px-2 bg-gray-600 rounded-full text-xs text-gray-300">
                            <span>K</span>
                        </div>
                    </div>
                </div>
                <span className="text-xs uppercase font-bold select-none text-gray-400">Chats</span>
                {conservations.map((i) => (
                    <Link key={i.id} href={`/app/conversation/${i.id}`} className="w-full bg-gray-700 hover:bg-gray-600 duration-300 cursor-pointer py-2 px-4 rounded flex flex-row items-center gap-3">
                        <img src="/anomz.png" width={32} draggable={false} alt="" />
                        <span>{getConversationName(auth.user,i)}</span>
                    </Link>
                ))}
            </div>
            <div className="w-full flex flex-col gap-3">
                <Hr/>
                <Button onClick={logout}>Logout</Button>
                <Button className="w-full rounded flex flex-row items-center gap-3 group">
                    <div className="relative">
                        <img src={auth.user?.avatar || "/anomz.png"} width={32} alt="" />
                        <span className="absolute bottom-0 right-0 w-[8px] h-[8px] bg-green-600 rounded-full"></span>
                    </div>
                    <span>{auth.user?.username}</span>
                </Button>
                <Button className="w-full bg-transparent rounded-full border-2 border-white hover:bg-white hover:text-black flex flex-row items-center justify-between group">
                    <span>Settings</span>
                    <Settings className="group-hover:rotate-45 duration-300" size={16}/>
                </Button>
            </div>
        </div>
    );
}
