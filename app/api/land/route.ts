import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const PUBLIC_URL =
    process.env.NEXT_PUBLIC_SUPABASE_URL + "/storage/v1/object/public/model/";

export async function POST(request: Request) {
    const requestBody = await request.json();
    const supabase = createRouteHandlerClient<Database>({ cookies });
    try {

        // 转换数据并插入到数据库中
        const transformedModels = requestBody.models.map((model: any) => {
            const { isSelect, ...rest } = model;
            return {
                ...rest,
                land_id: requestBody.id,
                created_at: new Date().toISOString(), // 使用 ISO 格式的日期字符串
            };
        });

        // 更新 land_info 表
        const { error: updateError } = await supabase
            .from('land_info')
            .update({ system_data: requestBody.systemInfo, operate_status: 1, model_url: PUBLIC_URL + `public/${requestBody.id}/scene.glb` })
            .eq('id', requestBody.id)
            .select()

        if (updateError) {
            throw new Error("Failed to update land_info.");
        }
        // 删除与特定地块相关的所有 block_models
        const { error: deleteError } = await supabase
            .from("block_models")
            .delete()
            .eq("land_id", requestBody.id);

        if (deleteError) {
            throw new Error("Failed to delete block_models associated with the specified land.");
        }


        const { data, error: insertError } = await supabase
            .from("block_models")
            .insert(transformedModels)
            .select();

        if (insertError) {
            console.log("transformedModels", transformedModels);

            throw new Error("Failed to insert block_models into the database.: " + insertError.message);
        }


        return new Response(JSON.stringify({ data }), { status: 200, headers: { "Content-Type": "application/json" } });
    } catch (error: any) {
        const { error: updateError } = await supabase
            .from('land_info')
            .update({ operate_status: 2 })
            .eq('id', requestBody.id)
            .select()
        console.error("An error occurred:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
}
