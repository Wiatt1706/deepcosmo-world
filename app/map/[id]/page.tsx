import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import ShowMapIndex from "@/components/map/layout/ShowMapIndex";
import LeftToolView from "@/components/map/layout/View_LeftTool";
import LeftMenuView from "@/components/map/layout/View_LeftMenu";
import { NotFoundWrapper } from "@/app/404";
export default async function MapInfo({
  searchParams,
  params,
}: {
  searchParams: any; // 此处的类型根据你的需要进行调整
  params: any;
}) {
  const landId = params?.id;

  const { zoom, x, y } = searchParams; // 默认页码为 1，每页显示数量为 12

  const supabase = createServerComponentClient<Database>({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  let { data: queryLand } = await supabase
    .from("land_info")
    .select("*")
    .eq("id", landId);

  if (!queryLand || queryLand[0].land_type !== "1") {
    return (
      <NotFoundWrapper>
        <div className="bodyBox ">没有找到该地块 或 该土块被禁止访问</div>
      </NotFoundWrapper>
    );
  }

  return (
    <div className="flex relative w-full h-full overflow-hidden">
      <LeftMenuView session={session} />
      <LeftToolView session={session} />

      <ShowMapIndex
        session={session}
        landInfo={queryLand[0]}
        loadScale={Number(zoom)}
        loadX={Number(x)}
        loadY={Number(y)}
      />
    </div>
  );
}
