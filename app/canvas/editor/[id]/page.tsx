import React from "react";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";
import { EdotorNavbar } from "@/components/canvas/editor/layout/navbar-layout";
import EditorMenuLeft from "@/components/canvas/editor/layout/menu-left-layout/menu-left";
import EditorCanvas from "@/components/canvas/editor/EditorCanvas";

export default async function land({ params }: any) {
  const supabase = createServerComponentClient({ cookies });

  let data = {};
  const { data: landWorldInfo } = await supabase
    .from("land_world_info")
    .select()
    .eq("id", params.id);

  if (!landWorldInfo || landWorldInfo.length === 0) {
    return <PageNotFound />;
  }
  data = landWorldInfo[0];

  return (
    <section className="flex flex-col items-center justify-center">
      <EdotorNavbar landWorldInfo={data} />
      <EditorCanvas />
      <EditorMenuLeft />
    </section>
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
