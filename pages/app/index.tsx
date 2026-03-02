import Button from "@/components/ui/Button";
import { useAuth } from "@/store/auth";
import { ShoppingCart, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function AppIndex() {
  const auth = useAuth();

  return (
    <div className="w-full h-auto overflow-auto p-4 flex flex-col items-start">
      <span className="text-xl font-semibold mb-4">Quick Start</span>
      <span>1. Learn your friend username</span>
      <span className="mb-4">2. Press CTRL+K and start chat with your friend</span>
      <Link href={"/donate"}>
        <Button>Donate</Button>
      </Link>
    </div>
  );
}
