import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    const res = await request.json()
    console.log("resjinninininininin::::", res);

    const supabase = createRouteHandlerClient<Database>({ cookies });

    const { error: deleteError } = await supabase
        .from("block_models")
        .delete()
        .eq("land_id", res.id);

    console.log("deleteError", deleteError);

    const transformedArray: BlockModels[] = res.models.map((item: any) => {
        const { isSelect, ...rest } = item; // 移除 isSelect 字段
        rest.land_id = res.id; // 添加新的 land_id 字段
        rest.created_at = new Date();
        return rest;
    });

    console.log("transformedArray", transformedArray);

    const { data, error: insertError } = await supabase
        .from("block_models")
        .insert(transformedArray)
        .select();
    console.log("insertError", insertError);

    return Response.json({ data })
}
