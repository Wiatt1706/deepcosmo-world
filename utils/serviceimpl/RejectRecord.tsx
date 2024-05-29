import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";

const RejectRecordService = {
  async toggleReject(
    supabase: SupabaseClient<Database>,
    postid: string,
    type: number, // 类型：0-抵制、1-举报
    userId: string,
    status: boolean
  ): Promise<boolean> {
    // 更新字段值
    const { data, error: updateError } = await supabase
      .from("RejectRecord")
      .update({ status: status })
      .eq("type", type)
      .eq("user_id", userId)
      .eq("post_id", postid);

    if (updateError) {
      console.error("Update operation failed:", updateError.message);
      return false;
    } else {
      console.log("Update operation successful:", data);
      return true;
    }
  },
  async findPostIsReject(
    supabase: SupabaseClient<Database>,
    userId: string,
    postId: string,
    type: number
  ): Promise<boolean | null> {
    const { data: rejectRecords, error } = await supabase
      .from("RejectRecord")
      .select("status")
      .eq("type", type)
      .eq("user_id", userId)
      .eq("post_id", postId);

    if (rejectRecords?.length == 0 || error) {
      return null;
    }
    return rejectRecords[0].status || false;
  },
  async saveReject(
    supabase: SupabaseClient<Database>,
    userId: string,
    postId: string,
    status: boolean,
    type: number
  ): Promise<boolean> {
    const { data, error } = await supabase
      .from("RejectRecord")
      .insert([{ user_id: userId, post_id: postId, status, type }])
      .select();

    if (data?.length == 0 || error) {
      console.log("saveReject failed:", error);
      return false;
    }
    return true;
  },
};
export default RejectRecordService;
