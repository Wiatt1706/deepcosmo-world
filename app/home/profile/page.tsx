import React from "react";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import PageNotFound from "@/app/404";
import MenuLeft from "@/components/layout/menu-left";
import UserInfoMenu from "@/components/land/user-info-menu";
import MyLandDataTable from "@/components/home/MyLandDataTable";
const orderByMap: Record<string, string> = {
  new: "created_at",
  level: "land_level",
};

// ViewSwitcher 组件
const MyLandData = async ({ searchParams }: { searchParams: any }) => {
  const supabase = createServerComponentClient({ cookies });
  const { page = 1, pageSize = 12, sort = "level", search } = searchParams;

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return <PageNotFound />;

  const { data: userInfo } = await supabase
    .from("profiles")
    .select()
    .eq("id", session.user.id);

  if (!userInfo?.length) return <PageNotFound />;

  // 查询总行数
  const countQuery = supabase
    .from("land_info")
    .select("count", { count: "exact" })
    .eq("land_owner", session.user.id);

  if (search) {
    countQuery.ilike("name", `%${search}%`);
  }

  const { count } = await countQuery;
  const calculatedTotalPages = Math.ceil((count || 0) / pageSize);

  // 主查询
  const mainQuery = supabase
    .from("land_info")
    .select("*, author: profiles(*), likes(*)")
    .eq("land_owner", session.user.id);

  if (search) {
    mainQuery.ilike("land_name", `%${search}%`);
  }

  const { data } = await mainQuery
    .range((page - 1) * pageSize, page * pageSize - 1)
    .order(orderByMap[sort] || orderByMap.level, { ascending: false });

  const lands =
    data?.map((land) => ({
      ...land,
      author: Array.isArray(land.author) ? land.author[0] : land.author,
      user_has_liked_land: !!land.likes.find(
        (like: any) => like.user_id === session?.user.id
      ),
      likes: land.likes.length,
    })) ?? [];

  return <MyLandDataTable lands={lands} />;
};

export default MyLandData;
