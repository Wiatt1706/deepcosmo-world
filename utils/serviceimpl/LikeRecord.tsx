import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";
interface LikeDTO {
  liked: boolean;
  post_id: string;
  comment_id?: number;
  type_index: number;
  type: number;
}

interface TypeIndexLikedMap {
  [key: number]: boolean;
}

const LIKE_TYPE_MAXNUM = 4;

const LikeRecordService = {
  async updateLikeRecord(
    supabase: SupabaseClient<Database>,
    likeDto: LikeDTO,
    userId: string
  ): Promise<boolean> {
    const query = supabase
      .from("LikeRecord")
      .select("*")
      .eq("post_id", likeDto.post_id)
      .eq("type_index", likeDto.type_index)
      .eq("user_id", userId)
      .eq("type", likeDto.type);

    if (likeDto.comment_id) {
      query.eq("comment_id", likeDto.comment_id);
    }

    const { data: likeRecord } = await query;
    console.log("likeRecord:", likeRecord);

    if (!likeRecord || likeRecord.length == 0) {
      await this.saveLikeRecord(supabase, likeDto, userId);
      return true;
    }
    console.log("likeRecord[0].liked:", likeRecord[0].liked);
    console.log("likeDto.liked:", likeDto.liked);
    console.log("vs:", likeRecord[0].liked === likeDto.liked);
    if (likeRecord[0].liked === likeDto.liked) {
      console.log("操作重复，希望跳出循环");

      return false; // 重复操作 直接跳过
    }

    const { error: updateError } = await supabase
      .from("LikeRecord")
      .update({ liked: likeDto.liked })
      .eq("id", likeRecord[0].id);
    if (updateError) {
      console.log("LikeRecordService-LikeRecord-update error:", updateError);
      return false;
    }
    return true;
  },

  async saveLikeRecord(
    supabase: SupabaseClient<Database>,
    likeDto: LikeDTO,
    userId: string
  ) {
    // Create a new object with only the necessary properties for insertion
    const insertObject = {
      user_id: userId,
      liked: likeDto.liked,
      type: likeDto.type,
      type_index: likeDto.type_index,
      post_id: likeDto.post_id,
      ...(likeDto.comment_id !== null && { comment_id: likeDto.comment_id }),
    };

    const { error } = await supabase.from("LikeRecord").insert([insertObject]);

    if (error) {
      console.log("LikeRecordService-saveLikeRecord error:", error);
      return false;
    }
    return true;
  },
  async queryByPostId(
    supabase: SupabaseClient<Database>,
    userId: string,
    postId: string,
    type: number
  ) {
    const { data: likeRecords, error } = await supabase
      .from("LikeRecord")
      .select("*")
      .eq("type", type)
      .eq("user_id", userId)
      .eq("post_id", postId);

    if (likeRecords?.length == 0 || error) {
      console.log("findByPostIdAndUserId error:", error);
      return [];
    }
    return likeRecords;
  },
  async findPostLikeArray(
    supabase: SupabaseClient<Database>,
    userId: string,
    postId: string,
    type: number
  ): Promise<boolean[]> {
    const likeRecords = await this.queryByPostId(
      supabase,
      userId,
      postId,
      type
    );
    // 将结果映射为类型索引和点赞状态的键值对
    const typeIndexLikedMap: TypeIndexLikedMap = likeRecords.reduce(
      (map, record) => {
        map[record.type_index] = record.liked;
        return map;
      },
      {} as TypeIndexLikedMap
    );

    // 构建点赞状态数组
    const booleanArray = Array.from(
      { length: LIKE_TYPE_MAXNUM },
      (_, i) => typeIndexLikedMap[i] || false
    );

    return booleanArray;
  },
  async removeLikeRecord(
    supabase: SupabaseClient<Database>,
    userId: string,
    postId: string,
    type: number
  ): Promise<boolean> {
    const { error } = await supabase
      .from("LikeRecord")
      .delete()
      .eq("type", type)
      .eq("user_id", userId)
      .eq("post_id", postId);
    if (error) {
      console.log("removeLikeRecord failed:", error);
      return false;
    } else {
      return true;
    }
  },
};

export default LikeRecordService;
