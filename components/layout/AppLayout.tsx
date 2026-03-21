import Navbar from "@/components/general/Navbar";

import { useAuth } from "@/store/auth";
import { ChangeEvent, ReactNode, useEffect, useState } from "react";
import Footer from "@/components/general/Footer";
import AppSideNavbar from "../general/AppSideNavbar";
import { Conversation, Message } from "@/types/types";
import { getPrivateKey, getToken } from "@/lib/auth";
import { ApiResponse } from "@/types/api";
import { getSocket } from "@/socket";
import { useRouter } from "next/router";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import { verifyKeyPair } from "@/lib/key";
import { Menu } from "lucide-react";

export default function AppLayout({ children }: {children:ReactNode}) {
  const auth = useAuth();
  const router = useRouter();
  const [loading,setLoading] = useState<boolean>(true);

  const [conversations,setConversations] = useState<Conversation[]>([]);

  const [uploadPrivateKeyModal,setUploadPrivateKeyModal] = useState<boolean>(false);

  useEffect(() => {
    (async() => {
      const token = getToken();

      let res = await fetch("/api/conversation",{
        headers:{
          Authorization:token,
        }
      });

      let json:ApiResponse<Conversation[]> = await res.json();

      if(!json.data) return router.push("/sign-in");

      setConversations(json.data);

      const socket = getSocket();

      socket?.on("message",(data:{conversation:Conversation,data:Message}) => {
        setConversations((prev) => {
          let latest = [...prev];
          let find = latest.find((conv) => conv.id == data.conversation.id);
          if(find) latest = latest.filter((e) => e.id != find.id);

          return [data.conversation,...latest];
        });
      });

      //setTimeout(() => {
        setLoading(false);        
      //}, 3000);
    })();

    let privateKey = getPrivateKey();
    if(!privateKey) setUploadPrivateKeyModal(true);
  },[]);

  const uploadPrivateKey = () => {
    let input = document.createElement("input");
    input.type = "file";

    input.addEventListener("change",(e) => {
        let reader = new FileReader();
        let file = e.target.files[0];

        reader.readAsText(file);

        reader.onloadend = async(ev) => {
          if(!ev.target?.result) return;

          let verify = await verifyKeyPair(auth.user?.publicKey,ev.target.result);

          if(!verify) return;

          try {
            localStorage.setItem("privateKey",ev.target.result);
            setUploadPrivateKeyModal(false);
          } catch (error) {
              
          }
        };
    });

    input.click();
  };

  const [mobileSideNavbar,setMobileSideNavbar] = useState<boolean>(false);

  useEffect(() => {
    setMobileSideNavbar(false);
  },[router.asPath]);

  if(auth.loading || loading || !auth.user) return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
      <img src="/anomz.png" width={128} className="animate-spin mb-4" draggable={false} alt="" />
      <span className="text-3xl font-semibold">Anomz</span>
      <span className="text-gray-400">Loading...</span>
      <div className="flex flex-col items-start mt-12">
        <span>"Hayat seni güldürmüyorsa espriyi anlamadın demektir."</span>
        <span className="font-semibold">-Anton Chekhov</span>
      </div>
    </div>
  );

  return (
    <>
      {
        <div className="w-full h-screen overflow-auto">
          <Modal className="w-full h-full flex flex-col items-center gap-5 pt-12" closable={false} open={uploadPrivateKeyModal} onClose={() => {setUploadPrivateKeyModal(false)}}>
            <span className="text-2xl font-semibold">Upload Your Private Key For Continue</span>
            <div className="flex flex-row items-center gap-3">
                <Button onClick={uploadPrivateKey} style={"green"}>Upload</Button>
                <Button style={"red"}>Generate New Private Key</Button>
            </div>
          </Modal>
          <Menu onClick={() => setMobileSideNavbar((e) => !e)} className="lg:hidden block fixed z-50 top-4 left-4 cursor-pointer" size={32}/>
          <div className="w-full flex flex-row items-start justify-end">
            <AppSideNavbar conservations={conversations} activeForMobile={mobileSideNavbar}/>
            <div className="lg:w-5/6 w-full h-screen max-h-screen overflow-auto">
              {children}
            </div>
          </div>
        </div>
      }
    </>
  );
}
