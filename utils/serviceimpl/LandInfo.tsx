import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";

const LandInfoService = {
  async queryById(supabase: SupabaseClient<Database>, id: number) {
    const { data: recordData, error } = await supabase
      .from("land_info")
      .select("*")
      .eq("id", id);
    if (!recordData || recordData.length == 0) {
      // 处理可能的错误
      console.error("LandInfoService.queryById error:", error);
      return null;
    }
    return recordData[0];
  },

  async saveRecord(supabase: SupabaseClient<Database>, dataList: Land[]) {
    const { error } = await supabase.from("land_info").insert(dataList);

    if (error) {
      console.error("LandInfoService.saveRecord error:", error);
      return false;
    }
    return true;
  },
  async deleteRecord(supabase: SupabaseClient<Database>, ids: string[]) {
    const { error } = await supabase.from("land_info").delete().in("id", ids);

    if (error) {
      console.error("LandInfoService.deleteRecord error:", error);
      return false;
    }
    return true;
  },
  async upsertRecord(
    supabase: SupabaseClient<Database>,
    dataList: Land[]
  ): Promise<boolean> {
    try {
      // 无论 dataList 是单条记录还是多条记录，都可以直接使用 upsert 方法
      for (let index = 0; index < dataList.length; index++) {
        const { error } = await supabase
          .from("land_info")
          .update(dataList[0])
          .eq("id", dataList[0].id);
        if (error) {
          console.error("LandInfoService.upsertRecord error:", error);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error("LandInfoService.upsertRecord unexpected error:", error);
      return false;
    }
  },
};
export default LandInfoService;
