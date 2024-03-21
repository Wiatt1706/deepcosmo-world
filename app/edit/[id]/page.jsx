import React from "react";
import LandWorld from "@/components/World/land";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { ToolView } from "@/components/World/editorTool/tool-layout";
import { Navbar } from "@/components/World/editorTool/navbar-layout";
import { InfoView } from "@/components/World/editorTool/property-layout";
import { ElementView } from "@/components/World/editorTool/element-layout";
import Link from "next/link";

export default async function land({ params }) {
  const supabase = createServerComponentClient({ cookies });

  let data = {};
  const { data: landInfo } = await supabase
    .from("land_info")
    .select()
    .eq("id", params.id);

  if (landInfo.length === 0) {
    return <PageNotFound />;
  }
  data = landInfo[0];
  const { data: models } = await supabase
    .from("block_models")
    .select()
    .eq("land_id", params.id);
  data.models = models;

  return (
    <section className="flex flex-col items-center justify-center">
      <Navbar landInfo={landInfo[0]} />
      <LandWorld info={data} />
      <ToolView />
      <InfoView />
      <ElementView />
    </section>
  );
}
function PageNotFound() {
  return (
    <div className="w-full p-4 text-center flex flex-col items-center justify-center">
      <h1>Page Not Found</h1>
      <p>The page you requested could not be found.</p>
      <Link href="/" className="text-blue-500">Back to Home</Link>
    </div>
  );
}
