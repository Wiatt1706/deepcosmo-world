import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    const requestBody = await request.json();
    const supabase = createRouteHandlerClient<Database>({ cookies });

    try {
        const listId: string = requestBody.listId || null;
        const listLinkIds: string[] = requestBody.listLinkIds || null;

        if (!listId || !listLinkIds || listLinkIds.length === 0) {
            return new Response(JSON.stringify({ error: "请提供合法入参" }), { status: 500, headers: { "Content-Type": "application/json" } });
        }

        const { data: userInfo, error: userInfoError } = await supabase.auth.getUser();

        if (!userInfo || userInfoError) {
            return new Response(JSON.stringify({ error: "用户未登录" }), { status: 401, headers: { "Content-Type": "application/json" } });
        }

        const userId = userInfo.user?.id as string;

        // Step 1: 查询已存在的 land_id
        const { data: existingItems, error: existingError } = await supabase
            .from("UserCustomItem")
            .select("land_id")
            .eq("user_custom_list_id", listId)
            .in("land_id", listLinkIds);

        if (existingError) {
            console.error("查询已存在记录时发生错误:", existingError.message);
            return new Response(JSON.stringify({ error: "查询记录失败，请稍后重试" }), { status: 500, headers: { "Content-Type": "application/json" } });
        }

        // Step 2: 过滤出不存在的 land_id
        const existingLandIds = existingItems.map((item) => item.land_id);
        const newLandIds = listLinkIds.filter((landId) => !existingLandIds.includes(landId));

        // Step 3: 如果没有新的 land_id 需要插入，则直接返回成功
        if (newLandIds.length === 0) {
            return new Response(JSON.stringify({ data: true, message: "该列表中，所有清单项已存在，无需添加" }), { status: 200, headers: { "Content-Type": "application/json" } });
        }

        // Step 4: 构建待插入的数据
        const insertData = newLandIds.map((landId) => ({
            user_custom_list_id: listId,
            land_id: landId,
            owner: userId
        }));

        // Step 5: 插入新数据
        const { data, error } = await supabase
            .from("UserCustomItem")
            .insert(insertData)
            .select();

        if (error) {
            console.error("UserCustomItem.InsertRecord error:", error.message);
            return new Response(JSON.stringify({ error: listId + ": 添加列表失败，请稍后重试" }), { status: 500, headers: { "Content-Type": "application/json" } });
        }

        return new Response(JSON.stringify({ data, message: "操作成功" }), { status: 200, headers: { "Content-Type": "application/json" } });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
}
