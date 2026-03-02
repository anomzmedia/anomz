import Navbar from "@/components/general/Navbar";

import { useAuth } from "@/store/auth";
import { ReactNode } from "react";
import Footer from "@/components/general/Footer";

export default function DefaultLayout({ children }: {children:ReactNode}) {
  const auth = useAuth();

  return (
    <>
      {
        <div className="w-full h-screen overflow-auto">
            <Navbar />
            {children}
            <Footer />
        </div>
      }
    </>
  );
}
