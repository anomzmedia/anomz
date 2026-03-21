import { prettyDate } from "@/lib/date";
import { useAuth } from "@/store/auth";
import { Message } from "@/types/types";

type MessageProps = {
    message: Message
};

export default function MessageComponent({message:_} : MessageProps){
    const auth = useAuth();
    
    return (
        <div className={`w-full flex flex-col ${_.sender?.id == auth.user?.id ? 'items-end' : 'items-start'}`}>
            <div className={`${_.sender?.id == auth.user?.id ? 'bg-blue-600' : 'bg-gray-600'} py-2 px-4 rounded flex flex-col items-start`}>
                <div className="flex flex-row items-center gap-3 mb-2">
                    <img className="select-none" src="/anomz.png" width={32} draggable={false} alt="" />
                    <span>{_.sender?.username || "System"}</span>
                </div>
                <span style={{whiteSpace:"pre-wrap"}}>{_.content}</span>
                {_.type == "SPOTIFY" ? <>
                    <iframe className="w-[500px] max-w-full mb-2" data-testid="embed-iframe" style={{borderRadius:"12px"}} src={`https://open.spotify.com/embed/track/${_.spotifyTrackId}?utm_source=generator`} width="100%" height="152" frameBorder="0" allowFullScreen={false} allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
                </> : <></>}
                <span className="text-xs text-blue-300 select-none">{prettyDate(new Date(_.createdAt))}</span>
            </div>
        </div>
    )
};