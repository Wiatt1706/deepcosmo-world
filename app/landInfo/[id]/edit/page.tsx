import React from "react";
import Link from "next/link";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import MenuLeft from "@/components/layout/menu-left";
import LandInfoMenu from "@/components/land/land-info-menu";
import NewMapIndex from "@/components/map/layout/NewMapIndex";

export default async function EditInfo({ params }: any) {
  const landId = params?.id;

  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return <PageNotFound />;
  }

  const { data: userInfo } = await supabase
    .from("profiles")
    .select()
    .eq("id", session?.user.id);

  if (!userInfo || userInfo.length === 0) {
    return <PageNotFound />;
  }

  let { data: landInfos } = await supabase
    .from("land_info")
    .select("*,author: profiles(*)")
    .eq("id", landId);

  if (!landInfos || landInfos.length === 0) {
    return <PageNotFound />;
  }
  const landInfo = landInfos[0];

  return (
    <div className="flex relative w-full h-full overflow-hidden">
      <MenuLeft>
        <LandInfoMenu landInfo={landInfo} menuactive="editor" />
      </MenuLeft>
      <div className="w-full max-h-screen h-full overflow-y-auto inline-block text-center justify-center bg-[#f3f6f8]">
        <NewMapIndex initLandInfo={landInfo} session={session} />
      </div>
    </div>
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
