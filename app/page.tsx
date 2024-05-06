import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Lands from "@/components/land/land-info";
import { Navbar } from "@/components/navbar";
import Footer from "@/components/layout/footer";
import { Chip } from "@nextui-org/react";

export default async function Home() {
 

  return (
    <>
      <Navbar />
    
      <Footer />
    </>
  );
}
