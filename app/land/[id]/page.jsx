import React from "react";
import LandWorld from "@/components/World/land";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { ToolView } from "@/components/comment-editor/tool";
import { Navbar } from "@/components/comment-editor/navbar";

export default async function land({ params }) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  let data = {};
  const { data: lands } = await supabase
    .from("land_info")
    .select()
    .eq("id", params.id);

  data = lands[0];
  const { data: models } = await supabase
    .from("block_models")
    .select()
    .eq("land_id", params.id);
  data.models = models;

  return (
    <section className="flex flex-col items-center justify-center">
      <Navbar title={data.land_name} />
      <LandWorld info={data} />
      <ToolView />
    </section>
  );
}
