import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";

const UploadService = {
  async uploadImg(
    supabase: SupabaseClient<Database>,
    bucket: string,
    filePath: string,
    fileBlob: Blob
  ): Promise<{
    id?: string;
    path: string;
    fullPath?: string;
  } | null> {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, fileBlob);
    if (data) {
      return data;
    }
    console.log("UploadService-uploadImg-error:", error);
    return null;
  },
  async deleteImg(
    supabase: SupabaseClient<Database>,
    bucket: string,
    keys: string[]
  ): Promise<boolean> {
    console.log("UploadService-deleteImg-keys:", keys);
    const { data, error } = await supabase.storage.from(bucket).remove(keys);
    if (error) {
      console.log("UploadService-deleteImg-error:", error);
      return false;
    }
    return true;
  },
};
export default UploadService;
