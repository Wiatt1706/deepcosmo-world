import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import {
    LikeRecordService,
    RejectRecordService,
    PxCmtyArticlesService,
} from "@/utils/serviceimpl";

interface LikeDTO {
    liked: boolean;
    post_id: string;
    comment_id?: number;
    type_index: number;
    type: number;
}

export async function POST(request: Request) {
    const requestBody = await request.json();
    const supabase = createRouteHandlerClient<Database>({ cookies });
    try {

        // 从请求参数中获取目标文章的ID

        const likeDTOList: LikeDTO[] = requestBody;

        if (likeDTOList.length === 0) {
            return new Response(JSON.stringify({ error: "请提供合法入参" }), { status: 500, headers: { "Content-Type": "application/json" } });
        }

        const { data: userInfo, error: userInfoError } =
            await supabase.auth.getUser();

        if (!userInfo || userInfoError) {
            return new Response(JSON.stringify({ error: "用户未登录" }), { status: 401, headers: { "Content-Type": "application/json" } });
        }

        const userId = userInfo.user?.id as string;
        const postId = likeDTOList[0].post_id;

        // 初始化点赞数组
        let likeArray = new Array(4).fill(0);

        const pxCmtyArticles = await PxCmtyArticlesService.queryById(
            supabase,
            postId as string
        );

        if (pxCmtyArticles == null) {
            return new Response(JSON.stringify({ error: "当前文章未找到" }), { status: 404, headers: { "Content-Type": "application/json" } });
        }

        if (pxCmtyArticles.like_array) {
            likeArray = pxCmtyArticles.like_array;
        }

        for (const likeDto of likeDTOList) {
            const result = await LikeRecordService.updateLikeRecord(
                supabase,
                likeDto,
                userId
            );

            if (!result) {
                continue;
            }

            // 如果 typeIndex 超过了现有数组长度，自动扩展数组并初始化新增部分为0
            if (
                likeArray !== null &&
                likeDto.type_index >= (likeArray as number[]).length
            ) {
                likeArray = Array.from({ length: likeDto.type_index + 1 }, (_, i) =>
                    i < (likeArray as number[]).length ? (likeArray as number[])[i] : 0
                );
            }
            // 更新 likeArray 中的特定位置
            likeArray[likeDto.type_index] += likeDto.liked ? 1 : -1;
        }

        // 更新文档点赞数据
        await supabase
            .from("PxCmtyArticles")
            .update({ like_array: likeArray })
            .eq("id", postId)
            .select();

        // 更新抵制数据
        RejectRecordService.toggleReject(supabase, postId, 0, userId, false);

        return new Response(JSON.stringify({ data: true, message: "操作成功" }), { status: 200, headers: { "Content-Type": "application/json" } });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
}
