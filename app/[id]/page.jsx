import React from "react";
import LandWorld from "@/components/World/land";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
export default async function land({ params }) {
  const supabase = createServerComponentClient({ cookies });

  let data = {};
  const { data: landInfo } = await supabase
    .from("land_info")
    .select()
    .eq("id", params.id);

  data = landInfo[0];
  const { data: models } = await supabase
    .from("block_models")
    .select()
    .eq("land_id", params.id);
  data.models = models;

  return (
    <section className="flex flex-col items-center justify-center">
      <LandWorld info={data} />
    </section>
  );
}
