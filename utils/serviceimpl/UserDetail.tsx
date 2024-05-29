import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";

type UserDetailDTO = {
  user_id: string;
  email?: string;
  avatar_url?: string;
  full_name?: string;
  website?: string;
};

const UserDetailService = {
  async updateAndSaveUserDetail(
    supabase: SupabaseClient<Database>,
    userDetail: UserDetailDTO
  ): Promise<boolean> {
    console.log("updateAndSaveUserDetail userDetail:", userDetail);
    const { data: userDetailOld, error: queryError } = await supabase
      .from("UserDetail")
      .select("user_id")
      .eq("user_id", userDetail.user_id);

    if (userDetailOld?.length == 0 || queryError) {
      console.log("updateAndSaveUserDetail error:", queryError);
      return this.saveUserDetail(supabase, userDetail);
    }

    const updateObject: Partial<UserDetailDTO> = {};

    if (userDetail.email !== undefined) {
      updateObject.email = userDetail.email;
    }

    if (userDetail.avatar_url !== undefined) {
      updateObject.avatar_url = userDetail.avatar_url;
    }

    if (userDetail.full_name !== undefined) {
      updateObject.full_name = userDetail.full_name;
    }

    if (userDetail.website !== undefined) {
      updateObject.website = userDetail.website;
    }

    const { error: updateError } = await supabase
      .from("UserDetail")
      .update(updateObject)
      .eq("user_id", userDetail.user_id);

    if (updateError) {
      // 处理可能的错误
      console.error("updateUserDetail error:", updateError);
      return false;
    }
    return true;
  },

  async saveUserDetail(
    supabase: SupabaseClient<Database>,
    userDetail: UserDetailDTO
  ) {
    const insertObject: Partial<UserDetailDTO> = {};

    if (userDetail.email !== undefined) {
      insertObject.email = userDetail.email;
    }

    if (userDetail.avatar_url !== undefined) {
      insertObject.avatar_url = userDetail.avatar_url;
    }

    if (userDetail.full_name !== undefined) {
      insertObject.full_name = userDetail.full_name;
    }

    if (userDetail.website !== undefined) {
      insertObject.website = userDetail.website;
    }
    const { data, error } = await supabase
      .from("UserDetail")
      .insert([insertObject]);

    if (!data || error) {
      // 处理可能的错误
      console.error("saveUserDetail error:", error);
      return false;
    }
    return true;
  },
};

export default UserDetailService;
