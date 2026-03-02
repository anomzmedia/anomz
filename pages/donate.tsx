import { useAuth } from "@/store/auth";
import { useEffect, useState } from "react";

export default function MainPage() {
    const auth = useAuth();

    const [isMounted, setIsMounted] = useState<boolean>(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) return (<></>);

    return (
        <>
            <div className="w-full min-h-screen pt-32 flex flex-col gap-5 items-center justify-center">
                <span className="text-2xl font-semibold">Place your username in the comment to the supporter tag...</span>
                <iframe src="https://nowpayments.io/embeds/donation-widget?api_key=ZFDE2FH-GYWMDT5-MPTW0MN-897FAHR" width="346" height="623" frameBorder="0" scrolling="no">
                    Can't load widget
                </iframe>
            </div>
        </>
    );
}
