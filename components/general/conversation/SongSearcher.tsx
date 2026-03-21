import Input from "@/components/ui/Input";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

export default function SongSearcher({selectSong,active,setActive}:{selectSong:(trackId:string) => void,active:boolean,setActive?:Dispatch<SetStateAction<boolean>>}) {
    const [search,setSearch] = useState<string>("");

    const [data,setData] = useState<any[]>([]);
    const timeout = useRef<NodeJS.Timeout|null>(null);

    const id = useRef(`song-searcher-${Math.floor(Math.random()*Date.now())}`);

    useEffect(() => {
        try {
            if(timeout.current) clearTimeout(timeout.current);
        } catch (error) {
            
        }

        timeout.current = setTimeout(async() => {
            let res = await fetch(`/api/spotify/search?q=${search || 'yağmurlar şebnem ferah'}`);
            let json = await res.json();

            if(!json.success) return;

            setData(json.data.tracks.items);
        }, 1000);
    },[search]);

    useEffect(() => {
        if(!setActive) return;
        const ff = (ev:PointerEvent) => {
            if(!ev.target.closest(`#${id.current}`) && !ev.target.closest(`.song-searcher-opener`)) setActive((active) => active ? false : false);
        };

        window.addEventListener("click",ff);

        return () => {
            window.removeEventListener("click",ff);
        };
    },[]);

    return (
        <div id={id.current} className={`absolute bg-black/30 w-[300px] h-[500px] z-50 right-10 bottom-full rounded-lg flex flex-col items-start py-2 px-4 gap-3 transition-all duration-300 ${active ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-full'}`}>
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search Music" className="w-full"/>
            <div className="flex flex-col items-start gap-3 w-full overflow-auto">
                {data.map((song) => <div onClick={() => selectSong(song.id)} className="flex flex-row items-center gap-3 border-2 border-gray-500/70 w-full rounded cursor-pointer">
                    <img src={song.album.images[0].url} width={64} className="rounded" draggable={false} alt="" />
                    <div className="flex flex-col items-start">
                        <span>{song.name}</span>
                        <span className="text-xs font-semibold">{song.artists[0].name}</span>
                    </div>
                </div>)}
            </div>
        </div>
    );
}
