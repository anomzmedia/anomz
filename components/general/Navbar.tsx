import { useAuth } from "@/store/auth";
import { Heart, ShoppingCart, Smile, User } from "lucide-react";
import Link from "next/link";
import Button from "../ui/Button";

export default function Navbar() {
    const auth = useAuth();

    const logout = () => {
        localStorage.removeItem("token");
        auth.setUser(null);
    };
    
    return (
        <nav className="z-50 backdrop-blur-sm fixed top-8 w-[95%] bg-gray-900/70 border-2 border-gray-800/70 shadow-xl left-1/2 -translate-x-1/2 rounded-full flex flex-row items-center justify-between py-2 px-4">
            {/*        <div className="w-full bg-gray-800 border-b-2 border-gray-700 py-6 px-12 grid grid-cols-3 items-center shadow-xl">
            <Link className="text-2xl font-semibold uppercase" href="/">Anomz</Link>
            <div className="flex flex-row items-start justify-center h-full">
            </div>
            <div className="flex flex-row items-center justify-end gap-5">
                {auth.user ? (
                    <>
                        <Link href={"/sign-in"} className="relative cursor-pointer">
                            <User/>
                        </Link>
                    </>
                ) : (
                    <>
                        <Link href={"/sign-in"} className="relative cursor-pointer">
                            <User/>
                        </Link>
                    </>
                )}
            </div>
        </div> */}
            <div className="flex flex-row items-center gap-3">
                <img src="/anomz.png" width={48} draggable={false} alt="" />
                <span className="text-2xl font-bold">Anomz</span>
            </div>
            <div className="flex flex-row items-center gap-3 font-semibold">
                <Link href={"/#home"}>Home</Link>
                <Link href={"/#pricing"}>Pricing</Link>
                <Link href={"/donate"}>Donate</Link>
                <Link href={"/app"}>
                    <Button className="rounded-full bg-indigo-600 hover:bg-indigo-800">App</Button>
                </Link>
            </div>
        </nav>
    );
}
