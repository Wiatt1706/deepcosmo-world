import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";
type PxCmtyArticlesDTO = {
  banner_img_url?: string | null;
  comment_record_num?: number | null;
  content?: string | null;
  description?: string | null;
  keywords?: number[] | null;
  like_array?: number[] | null;
  title?: string | null;
  user_id?: string | null;
};

const PxCmtyArticlesService = {
  async updateDataById(
    supabase: SupabaseClient<Database>,
    pxCmtyArticlesDTO: PxCmtyArticlesDTO,
    postId: string
  ): Promise<boolean> {
    const { error: updateError } = await supabase
      .from("PxCmtyArticles")
      .update(pxCmtyArticlesDTO)
      .eq("id", postId);

    if (updateError) {
      console.error("PxCmtyArticlesService-updateDataById error:", updateError);
      return false;
    }

    return true;
  },
  async updateLikeArray(
    supabase: SupabaseClient<Database>,
    postId: string,
    liked: boolean,
    typeIndex: number
  ): Promise<boolean> {
    const pxCmtyArticle = await this.queryById(supabase, postId);
    if (!pxCmtyArticle || pxCmtyArticle == null) {
      // 处理可能的错误
      console.error("未找到合法的文章数据:", postId);
      return false;
    }

    let likeArray: number[] | null = pxCmtyArticle.like_array;

    // 为空初始化为 [0,0,0,0]
    if (likeArray == null) {
      likeArray = new Array(4).fill(0);
    }

    // 如果 typeIndex 超过了现有数组长度，自动扩展数组并初始化新增部分为0
    if (likeArray !== null && typeIndex >= (likeArray as number[]).length) {
      likeArray = Array.from({ length: typeIndex + 1 }, (_, i) =>
        i < (likeArray as number[]).length ? (likeArray as number[])[i] : 0
      );
    }

    // 根据 liked 来判断是加一还是减一
    const incrementValue = liked ? 1 : -1;

    // 更新 likeArray 中的特定位置
    likeArray[typeIndex] += incrementValue;

    const { data, error: updateError } = await supabase
      .from("PxCmtyArticles")
      .update({ like_array: likeArray })
      .eq("id", postId)
      .select();

    if (!data || updateError) {
      console.error("updateLikeArray updateError:", updateError);
      return false;
    }
    return true;
  },
  async queryById(supabase: SupabaseClient<Database>, postId: string) {
    const { data: pxCmtyArticles, error } = await supabase
      .from("PxCmtyArticles")
      .select("*,profiles(*)")
      .eq("id", postId);
    if (!pxCmtyArticles || pxCmtyArticles.length == 0) {
      // 处理可能的错误
      console.error("PxCmtyArticlesService.queryById error:", error);
      return null;
    }
    return pxCmtyArticles[0];
  },
};
export default PxCmtyArticlesService;
