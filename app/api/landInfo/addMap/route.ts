import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { PixelBlock } from "@/types/MapTypes";
import { LandInfoService } from "@/utils/serviceimpl";
import { handleAddedLands } from "../route";

export async function POST(request: Request) {
    const requestBody = await request.json();
    const supabase = createRouteHandlerClient<Database>({ cookies });

    try {
        // 获取请求中的 pixelBlocks 数组和 parent_land_id
        const requestDTO: PixelBlock = requestBody.pixelBlocks;
        const deleteIds: string[] = requestBody.deleteIds;

        const parentLandId: string | null = requestBody.parentLandId || null;


        if (!requestDTO || !deleteIds || deleteIds.length === 0 || !parentLandId) {
            return new Response(JSON.stringify({ error: "请提供合法入参" }), { status: 500, headers: { "Content-Type": "application/json" } });
        }

        const { data: userInfo, error: userInfoError } = await supabase.auth.getUser();

        if (!userInfo || userInfoError) {
            return new Response(JSON.stringify({ error: "用户未登录" }), { status: 401, headers: { "Content-Type": "application/json" } });
        }

        const userId = userInfo.user?.id as string;
        const ss = handleAddedLands([requestDTO], userId, parentLandId);

        // 将生成的 Land 对象列表保存到数据库
        const data = await LandInfoService.saveRecord(supabase, ss);

        if (!data) {
            return new Response(JSON.stringify({ error: "操作失败" }), { status: 500, headers: { "Content-Type": "application/json" } });
        }


        // 删除已经添加的地块
        const { error } = await supabase
            .from("land_info")
            .delete()
            .in("id", deleteIds);
        if (error) {
            console.error("LandInfoService.deleteRecord error:", error);
        }


        // 更新用户土块币
        const { error: rpcError } = await supabase.rpc("increment_land_coins", {
            user_id: userId,
            increment_value: -deleteIds.length,
        });

        return new Response(JSON.stringify({ data: true, message: "操作成功" }), { status: 200, headers: { "Content-Type": "application/json" } });
    } catch (error: any) {
        console.log("error:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
}
