import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import {
    LikeRecordService,
    RejectRecordService,
    PxCmtyArticlesService,
} from "@/utils/serviceimpl";
import { SupabaseClient } from "@supabase/supabase-js";


export async function PUT(request: Request) {
    const url = new URL(request.url);
    const postId = url.searchParams.get('postId');
    if (!postId) {
        return new Response(JSON.stringify({ error: "请提供合法入参" }), { status: 500, headers: { "Content-Type": "application/json" } });
    }

    const supabase = createRouteHandlerClient<Database>({ cookies });
    try {

        const { data: userInfo, error: userInfoError } =
            await supabase.auth.getUser();

        if (!userInfo || userInfoError) {
            return new Response(JSON.stringify({ error: "用户未登录" }), { status: 401, headers: { "Content-Type": "application/json" } });
        }
        const userId = userInfo.user?.id as string;


        // 获取当前用户的抵制记录
        const isReject = await RejectRecordService.findPostIsReject(
            supabase,
            userId,
            postId as string,
            0
        );

        // 生成抵制记录
        if (isReject == null) {
            await RejectRecordService.saveReject(
                supabase,
                userId,
                postId as string,
                true,
                0
            );
        } else if (isReject) {
            // 是否已经存在抵制数据 -  撤销抵制
            // 更新抵制数据 - 失效
            RejectRecordService.toggleReject(
                supabase,
                postId as string,
                0,
                userId,
                false
            );
            return new Response(JSON.stringify({ data: true, message: "已撤销抵制" }), { status: 200, headers: { "Content-Type": "application/json" } });
        } else {
            // 更新抵制数据 - 激活
            RejectRecordService.toggleReject(
                supabase,
                postId as string,
                0,
                userId,
                true
            );
        }
        // 更新文档点赞数据，清除用户点赞记录
        await rejectLikeRecord(supabase, userId, postId as string, 0);

        return new Response(JSON.stringify({ data: true, message: "操作成功" }), { status: 200, headers: { "Content-Type": "application/json" } });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
}



const rejectLikeRecord = async (
    supabase: SupabaseClient<Database>,
    userId: string,
    postId: string,
    type: number
) => {
    const pxCmtyArticles = await PxCmtyArticlesService.queryById(
        supabase,
        postId as string
    );
    if (pxCmtyArticles == null || !pxCmtyArticles.like_array) {
        return;
    }
    // 初始化点赞数组
    let likeArray = pxCmtyArticles.like_array;

    // 获取当前用户的点赞记录
    const likeBoolranArray = await LikeRecordService.findPostLikeArray(
        supabase,
        userId,
        postId as string,
        type
    );

    likeBoolranArray.forEach((record, index) => {
        if (record) {
            likeArray[index] += -1;
        }
    });

    // 更新文档点赞数据
    await supabase
        .from("PxCmtyArticles")
        .update({ like_array: likeArray })
        .eq("id", postId)
        .select();

    // 移除用户点赞记录
    await LikeRecordService.removeLikeRecord(
        supabase,
        userId,
        postId as string,
        type
    );
};
