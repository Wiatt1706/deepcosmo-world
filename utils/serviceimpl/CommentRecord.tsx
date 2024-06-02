import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";

export type CommentRecordDTO = {
  parent_id?: number;
  comment_id?: number;
  content: string;
  image_url?: string;
  post_id: string;
};

const CommentRecordService = {
  async queryById(supabase: SupabaseClient<Database>, id: number) {
    const { data: commentRecord, error } = await supabase
      .from("CommentRecord")
      .select("*")
      .eq("id", id);
    if (!commentRecord || commentRecord.length == 0) {
      // 处理可能的错误
      console.error("CommentRecordService.queryById error:", error);
      return null;
    }
    return commentRecord[0];
  },
  async queryByPostId(supabase: SupabaseClient<Database>, postId: string) {
    const { data: commentRecordList, error } = await supabase
      .from("CommentRecord")
      .select("*,profiles(*)")
      .eq("post_id", postId);
    if (!commentRecordList || commentRecordList.length == 0) {
      // 处理可能的错误
      console.error("CommentRecordService.queryByPostId error:", error);
      return null;
    }

    return commentRecordList;
  },
  async saveCommentRecord(
    supabase: SupabaseClient<Database>,
    commentDTO: CommentRecordDTO,
    user_id: string
  ) {
    // Create a new object with only the necessary properties for insertion
    const insertObject = {
      parent_id: commentDTO.parent_id,
      content: commentDTO.content,
      post_id: commentDTO.post_id,
      user_id: user_id,
      ...(commentDTO.parent_id !== null && {
        parent_id: commentDTO.parent_id,
      }),
      ...(commentDTO.comment_id !== null && {
        comment_id: commentDTO.comment_id,
      }),
      ...(commentDTO.image_url !== null && {
        image_url: commentDTO.image_url,
      }),
    };

    const { error } = await supabase
      .from("CommentRecord")
      .insert([insertObject]);

    if (error) {
      console.error("CommentRecordService error:", error);
      return false;
    }
    return true;
  },
  async updateLikeNum(
    supabase: SupabaseClient<Database>,
    commentId: number,
    liked: boolean
  ): Promise<boolean> {
    // 查询当前点赞数
    const { data: currentData, error } = await supabase
      .from("CommentRecord")
      .select("like_num")
      .eq("id", commentId)
      .single(); // 使用 single 方法获取单个记录

    if (error) {
      console.error("Error fetching current data:", error.message);
      return false;
    }

    let currentLikeNum: number = currentData?.like_num
      ? currentData.like_num
      : 0;

    // 计算新的点赞数
    const newLikeNum = liked ? currentLikeNum + 1 : currentLikeNum - 1;

    // 更新字段值
    const { data, error: updateError } = await supabase
      .from("CommentRecord")
      .update({ like_num: newLikeNum })
      .eq("id", commentId);

    if (updateError) {
      console.error("Update operation failed:", updateError.message);
      return false;
    } else {
      console.log("updateLikeNum successful:", data);
      return true;
    }
  },
};
export default CommentRecordService;
