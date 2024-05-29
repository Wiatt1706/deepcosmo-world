import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";

const KeywordService = {
  async findByIds(supabase: SupabaseClient<Database>, keywords: number[]) {
    const { data, error } = await supabase
      .from("Keyword")
      .select("id,color,description,label_name,label_type")
      .in("id", keywords);

    if (data?.length == 0 || error) {
      return null;
    }
    return data;
  },
};
export default KeywordService;
