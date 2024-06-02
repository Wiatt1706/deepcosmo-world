import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";
const PUBLIC_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

const UploadService = {
  async uploadImg(
    supabase: SupabaseClient<Database>,
    bucket: string,
    filePath: string,
    fileBlob: Blob
  ): Promise<String | null> {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, fileBlob, {
        upsert: true,
      });
    if (data) {
      return `${PUBLIC_URL}/storage/v1/object/public/${bucket}/${filePath}`;
    }

    console.log("UploadService:", error);

    return null;
  },
};
export default UploadService;
