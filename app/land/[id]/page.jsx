import React from "react";
import LandWorld from "@/components/World/land";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { ToolView } from "@/components/comment-editor/tool";

export default async function land({ params }) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data } = await supabase
    .from("block_models")
    .select()
    .eq("land_id", params.id);

  return (
    <section className="flex flex-col items-center justify-center">
      <LandWorld id={params.id} models={data} />
      <ToolView />
    </section>
  );
}
