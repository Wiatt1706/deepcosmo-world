import React from "react";
import Link from "next/link";
import HomeLand from "@/components/land/home-land";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function Home() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session || session.length === 0) {
    return <PageNotFound />;
  }

  const { data: userInfo } = await supabase
    .from("profiles")
    .select()
    .eq("id", session?.user.id);

  if (userInfo.length === 0) {
    return <PageNotFound />;
  }
  return (
    <>
      <HomeLand />
    </>
  );
}

function PageNotFound() {
  return (
    <div className="w-full p-4 text-center flex flex-col items-center justify-center">
      <h1>Page Not Found</h1>
      <p>The page you requested could not be found.</p>
      <Link href="/" className="text-blue-500">
        Back to Home
      </Link>
    </div>
  );
}
