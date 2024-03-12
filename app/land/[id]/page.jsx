import React from "react";
import LandWorld from "@/components/World/land";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { ToolView } from "@/components/World/editorTool/tool-layout";
import { Navbar } from "@/components/World/editorTool/navbar-layout";
import { InfoView } from "@/components/World/editorTool/property-layout";
import { ElementView } from "@/components/World/editorTool/element-layout";

export default async function land({ params }) {
  const supabase = createServerComponentClient({ cookies });

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
      <InfoView />
      <ElementView />
    </section>
  );
}
