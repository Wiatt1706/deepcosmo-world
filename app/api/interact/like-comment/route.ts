import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import {
    LikeRecordService,
    CommentRecordService,
} from "@/utils/serviceimpl";


interface LikeDTO {
    liked: boolean;
    post_id: string;
    comment_id: number;
    type_index: number;
    type: number;
}

export async function POST(request: Request) {
    const requestBody = await request.json();
    const supabase = createRouteHandlerClient<Database>({ cookies });
    try {
        const likeDTOItem: LikeDTO = requestBody;

        if (!likeDTOItem) {
            return new Response(JSON.stringify({ error: "请提供合法入参" }), { status: 500, headers: { "Content-Type": "application/json" } });
        }

        const { data: userInfo, error: userInfoError } =
            await supabase.auth.getUser();

        if (!userInfo || userInfoError) {
            return new Response(JSON.stringify({ error: "用户未登录" }), { status: 401, headers: { "Content-Type": "application/json" } });
        }

        const userId = userInfo.user?.id as string;


        const commentRecord = await CommentRecordService.queryById(
            supabase,
            likeDTOItem.comment_id
        );

        if (commentRecord == null) {
            return new Response(JSON.stringify({ error: "当前评论未找到" }), { status: 404, headers: { "Content-Type": "application/json" } });
        }

        let likeNum = commentRecord.like_num | 0;

        const result = await LikeRecordService.updateLikeRecord(
            supabase,
            likeDTOItem,
            userId
        );

        // 更新 likeArray 中的特定位置
        likeNum += likeDTOItem.liked ? 1 : -1;

        // 更新文档点赞数据
        await supabase
            .from("CommentRecord")
            .update({ like_num: likeNum })
            .eq("id", commentRecord.id)
            .select();

        return new Response(JSON.stringify({ data: true, message: "操作成功" }), { status: 200, headers: { "Content-Type": "application/json" } });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
}
