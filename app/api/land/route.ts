// pages/api/test.ts

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    const res = await request.json()
    console.log("resjinninininininin::::", res);
    const supabase = createRouteHandlerClient({ cookies });
    const { error: deleteError } = await supabase
        .from("block_models")
        .delete()
        .eq("land_id", res.id);

    console.log("deleteError", deleteError);

    const { data, error: insertError } = await supabase
        .from("block_models")
        .insert(res.modelList)
        .select();
    console.log("insertError", insertError);

    return Response.json({ data })
}
