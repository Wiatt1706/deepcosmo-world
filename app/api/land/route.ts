import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
export async function POST(request: Request) {
    try {
        const requestBody = await request.json();
        console.log("Request Body:", requestBody);

        const supabase = createRouteHandlerClient<Database>({ cookies });

        // 删除与特定地块相关的所有 block_models
        const { error: deleteError } = await supabase
            .from("block_models")
            .delete()
            .eq("land_id", requestBody.id);

        if (deleteError) {
            throw new Error("Failed to delete block_models associated with the specified land.");
        }

        // 转换数据并插入到数据库中
        const transformedModels = requestBody.models.map((model: any) => {
            const { isSelect, ...rest } = model;
            return {
                ...rest,
                land_id: requestBody.id,
                created_at: new Date().toISOString(), // 使用 ISO 格式的日期字符串
            };
        });

        const { data, error: insertError } = await supabase
            .from("block_models")
            .insert(transformedModels)
            .select();

        if (insertError) {
            throw new Error("Failed to insert block_models into the database.");
        }

        return new Response(JSON.stringify({ data }), { status: 200, headers: { "Content-Type": "application/json" } });
    } catch (error: any) {
        console.error("An error occurred:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
}
