import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { PixelBlock } from "@/types/MapTypes";
import ShowMapIndex from "@/components/map/layout/ShowMapIndex";
export default async function EditInfo({
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

  let { data: requestDTOs } = await supabase
    .from("land_info")
    .select(
      "id,land_name,world_coordinates_x,world_coordinates_y,world_size_x,world_size_y,fill_color,border_size,block_count,land_type,land_status,cover_icon_url"
    )
    .eq("parent_land_id", landId);

  const pixelBlocks: PixelBlock[] =
    requestDTOs?.map((requestDTO: any) => {
      return {
        id: requestDTO.id,
        name: requestDTO.land_name,
        x: requestDTO.world_coordinates_x,
        y: requestDTO.world_coordinates_y,
        width: requestDTO.world_size_x,
        height: requestDTO.world_size_y,
        color: requestDTO.fill_color,
        borderSize: requestDTO.border_size,
        blockCount: requestDTO.block_count,
        type: parseInt(requestDTO.land_type),
        status: parseInt(requestDTO.land_status),
        landCoverImg: requestDTO.cover_icon_url, // 如果没有封面图片，则设置为undefined
      } as PixelBlock;
    }) || [];

  return (
    <div className="flex relative w-full h-full overflow-hidden">
      <ShowMapIndex
        loadData={pixelBlocks}
        loadScale={Number(zoom)}
        loadX={Number(x)}
        loadY={Number(y)}
        session={session}
      />
    </div>
  );
}
