import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import {
    CommentRecordService,
    CommentRecordDTO,
    PxCmtyArticlesService,
    LikeRecordService
} from "@/utils/serviceimpl";
import { SupabaseClient } from "@supabase/supabase-js";
export async function POST(request: Request) {
    const requestBody = await request.json();
    const supabase = createRouteHandlerClient<Database>({ cookies });
    try {

        // 从请求参数中获取目标文章的ID

        const commentDTO: CommentRecordDTO = requestBody;

        if (!commentDTO) {
            return new Response(JSON.stringify({ error: "请提供合法入参" }), { status: 500, headers: { "Content-Type": "application/json" } });
        }

        const { data: userInfo, error: userInfoError } =
            await supabase.auth.getUser();

        if (!userInfo || userInfoError) {
            return new Response(JSON.stringify({ error: "用户未登录" }), { status: 401, headers: { "Content-Type": "application/json" } });
        }

        const userId = userInfo.user?.id as string;
        await CommentRecordService.saveCommentRecord(supabase, commentDTO, userId);

        const pxCmtyArticle = await PxCmtyArticlesService.queryById(
            supabase,
            commentDTO.post_id
        );

        const data = await PxCmtyArticlesService.updateDataById(
            supabase,
            {
                comment_record_num: (pxCmtyArticle?.comment_record_num || 0) + 1,
            },
            commentDTO.post_id
        );

        return new Response(JSON.stringify({ data }), { status: 200, headers: { "Content-Type": "application/json" } });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
}


export async function GET(request: Request) {
    const url = new URL(request.url);
    const postId = url.searchParams.get('postId');
    if (!postId) {
        return new Response(JSON.stringify({ error: "请提供合法入参" }), { status: 401, headers: { "Content-Type": "application/json" } });
    }
    const supabase = createRouteHandlerClient<Database>({ cookies });
    try {
        let userId: string | null = null;
        const { data: userInfo, error: userInfoError } =
            await supabase.auth.getUser();

        if (userInfo && !userInfoError) {
            userId = userInfo.user?.id as string;
        }

        return new Response(JSON.stringify(await getCommentRecord(supabase, userId, postId as string)), { status: 200, headers: { "Content-Type": "application/json" } });

    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
}


const getCommentRecord = async (
    supabase: SupabaseClient<Database>,
    userId: string | null,
    postId: string
) => {
    // 获取当前用户的评论点赞记录（仅在登录用户时查询）
    let likeRecord: Database["public"]["Tables"]["LikeRecord"]["Row"][] = [];
    if (userId) {
        likeRecord = await LikeRecordService.queryByPostId(
            supabase,
            userId,
            postId as string,
            1
        );
    }

    const commentList = await CommentRecordService.queryByPostId(
        supabase,
        postId as string
    );
    if (commentList == null) {
        return { data: [], count: 0 };
    }

    const buildCommentTree = (
        comments: Database["public"]["Tables"]["CommentRecord"]["Row"][],
        parentId?: number
    ): any[] => {
        return comments
            .filter((comment) => comment.parent_id === parentId)
            .map((comment) => {
                const is_author = userId ? comment.user_id === userId : false;
                const is_liked = userId
                    ? likeRecord.some(
                        (like) => like.comment_id === comment.id && like.liked
                    )
                    : false;
                const target_comment =
                    comment.comment_id != comment.parent_id &&
                    comments.find((item) => item.id === comment.comment_id);
                return {
                    ...comment,
                    is_author,
                    is_liked,
                    target_comment,
                    commentRecords: buildCommentTree(comments, comment.id),
                };
            });
    };

    // 在函数调用时使用默认参数值和空值合并运算符
    const result = buildCommentTree(commentList, 0);

    return { data: result, count: commentList.length };
};
