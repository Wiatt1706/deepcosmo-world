import React from "react";
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

  let { data: requestDTOs } = await supabase
    .from("land_info")
    .select("*,author: profiles(*),ShowCoverImg(*)")
    .eq("parent_land_id", landId);

  const pixelBlocks: PixelBlock[] =
    requestDTOs?.map((requestDTO: Land) => {
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
        showCoverImgList: requestDTO.show_cover_list,
        skipUrl: requestDTO.skip_url, // 处理可选的跳转URL
        useExternalLink: requestDTO.use_external_link, // 布尔值直接映射
        externalLinkType: requestDTO.external_link_type, // 处理可选的外部链接类型
        externalLink: requestDTO.external_link, // 处理可选的外部链接
      } as PixelBlock;
    }) || [];

  return (
    <ShowMapIndex
      loadData={pixelBlocks}
      loadScale={Number(zoom)}
      loadX={Number(x)}
      loadY={Number(y)}
    />
  );
}
