import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET() {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    try {
        const { data: userInfo, error: userInfoError } = await supabase.auth.getUser();
        if (!userInfo || userInfoError) {
            return new Response(JSON.stringify({ error: "用户未登录" }), { status: 401, headers: { "Content-Type": "application/json" } });
        }

        const userId = userInfo.user?.id as string;

        const { data } = await supabase.from("UserCustomList").select("id, name, describe, type, status, sort").eq("owner", userId);

        if (data) {
            return new Response(JSON.stringify({ data, message: "操作成功" }), { status: 200, headers: { "Content-Type": "application/json" } });
        }
        return new Response(JSON.stringify({ error: "列表数据为空" }), { status: 500, headers: { "Content-Type": "application/json" } });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
}


export async function POST(request: Request) {
    const requestBody = await request.json();
    const supabase = createRouteHandlerClient<Database>({ cookies });

    try {
        const name: string = requestBody.name || null;
        const type: string = requestBody.type || null;
        const sort: string = requestBody.sort || 0;

        if (!name || !type) {
            return new Response(JSON.stringify({ error: "请提供合法入参" }), { status: 500, headers: { "Content-Type": "application/json" } });
        }

        const { data: userInfo, error: userInfoError } = await supabase.auth.getUser();

        if (!userInfo || userInfoError) {
            return new Response(JSON.stringify({ error: "用户未登录" }), { status: 401, headers: { "Content-Type": "application/json" } });
        }

        const userId = userInfo.user?.id as string;

        const { data, error } = await supabase.from("UserCustomList").insert({
            name: name,
            type: type,
            owner: userId,
            sort: sort
        }).select();

        if (error) {
            console.error("userCustomList.InsertRecord error:", error.message);
            return new Response(JSON.stringify({ error: "新建列表失败，请稍后重试" }), { status: 500, headers: { "Content-Type": "application/json" } });
        }

        return new Response(JSON.stringify({ data: data[0], message: "操作成功" }), { status: 200, headers: { "Content-Type": "application/json" } });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
}