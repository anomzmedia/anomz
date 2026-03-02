import { useAuth } from "@/store/auth";
import { Check, CheckCheckIcon, CheckCircle, CheckCircle2, MessageCircle, ShoppingCart, X } from "lucide-react";
import intl from "../lib/intl";
import Link from "next/link";
import { useState } from "react";
import Button from "@/components/ui/Button";

export default function MainPage() {
  const auth = useAuth();


  return (
    <>
      <div id="home" className="w-full h-screen flex flex-col items-center pt-32 pb-32">
        <div className="lg:w-2/3 w-full h-full flex flex-col items-center justify-center">
          <div className="bg-white rounded-lg text-black w-24 h-24 relative mb-4">
            <MessageCircle className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" size={64}/>
          </div>
          <span className="text-4xl font-bold">100% Free Anonymous Communication</span>
          <span className="text-gray-400">100% Free Anonymous Communication</span>
          <Link href={"/app"}>
            <Button className="rounded-full bg-white hover:bg-gray-200! text-black mt-4">Join For Free</Button>
          </Link>
        </div>
      </div>
      <div id="pricing" className="w-full h-screen flex flex-col items-center pt-32">
        <div className="lg:w-2/3 w-full h-full flex flex-col items-center">
          <span className="text-4xl font-bold mb-4">100% Free</span>
          <div className="w-full grid lg:grid-cols-2 grid-cols-1">
            <div className="border-2 py-2 px-4 w-full flex flex-col items-start justify-between gap-5">
              <span className="font-bold text-gray-400 text-xl">Free</span>
              <span className="text-6xl font-semibold mb-4">$0</span>
              <div className="flex flex-row items-center gap-3">
                <CheckCircle2/>
                <span>Unlimited Usage</span>
              </div>
              <Link className="w-full" href={"/app"}>
                <Button className="bg-white hover:bg-gray-200! text-black w-full justify-center font-semibold">Get Started</Button>
              </Link>
            </div>
            <div className="border-2 py-2 px-4 w-full flex flex-col items-start justify-between gap-5 lg:-ml-0.5 -mt-0.5 lg:mt-0">
              <span className="font-bold text-gray-400 text-xl">Supporter</span>
              <span className="text-6xl font-semibold mb-4">$&infin;</span>
              <div className="flex flex-row items-center gap-3">
                <CheckCircle2/>
                <span>Unlimited Usage</span>
              </div>
              <div className="flex flex-row items-center gap-3">
                <CheckCircle2/>
                <span>Supporter Tag</span>
              </div>
              <Link className="w-full" href={"/donate"}>
                <Button className="bg-white hover:bg-gray-200! text-black w-full justify-center font-semibold">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
