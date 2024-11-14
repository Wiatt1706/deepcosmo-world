import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";


export async function POST(request: Request) {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    const rewardCode = "FirstLoginReward";
    try {
        const { data: userInfo, error: userInfoError } = await supabase.auth.getUser();

        if (!userInfo || userInfoError) {
            return new Response(JSON.stringify({ error: "用户未登录" }), { status: 401, headers: { "Content-Type": "application/json" } });
        }

        const userId = userInfo.user?.id as string;

        const { data: activitiesData, error: activitiesError } = await supabase.from("Activities").select("*").eq("is_valid", true).eq("system_code", rewardCode);

        if (activitiesError) {
            return new Response(JSON.stringify({ error: "查询错误", details: activitiesError.message }), { status: 500, headers: { "Content-Type": "application/json" } });
        }

        if (!activitiesData || activitiesData.length === 0) {
            return new Response(JSON.stringify({ error: "不存在此活动，或此活动已过期" }), { status: 200, headers: { "Content-Type": "application/json" } });
        }

        // 执行查询
        const { count: existingCount, error: existingListError } = await supabase
            .from("ActivitiesUser")
            .select("*", { count: 'exact', head: true })
            .eq("user_id", userId)
            .eq("is_completed", true)
            .eq("system_code", rewardCode);

        if (existingListError) {
            return new Response(JSON.stringify({ error: "查询错误", details: existingListError.message }), { status: 500, headers: { "Content-Type": "application/json" } });
        }

        if (existingCount && existingCount > 0) {
            return new Response(JSON.stringify({ error: "已存在该领取记录" }), { status: 200, headers: { "Content-Type": "application/json" } });
        }

        const { error: insertError } = await supabase.from("ActivitiesUser").insert({
            user_id: userId,
            is_completed: true,
            activity_id: activitiesData[0].id,
            system_code: rewardCode
        });

        if (insertError) {
            console.error("FirstLoginReward.InsertRecord error:", insertError.message);
            return new Response(JSON.stringify({ error: "新建列表失败，请稍后重试" }), { status: 500, headers: { "Content-Type": "application/json" } });
        }
        const { error: rpcError } = await supabase.rpc("increment_land_coins", {
            user_id: userId,
            increment_value: 1
        });

        return new Response(JSON.stringify({ data: true, message: "操作成功" }), { status: 200, headers: { "Content-Type": "application/json" } });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
}