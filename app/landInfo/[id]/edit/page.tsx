import React from "react";
import Link from "next/link";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import MenuLeft from "@/components/layout/menu-left";
import LandInfoMenu from "@/components/land/land-info-menu";
import EditMapIndex from "@/components/map/layout/EditMapIndex";
import { PixelBlock } from "@/types/MapTypes";

export default async function EditInfo({ params }: any) {
  const landId = params?.id;

  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return <PageNotFound />;
  }

  const { data: userInfo } = await supabase
    .from("profiles")
    .select()
    .eq("id", session?.user.id);

  if (!userInfo || userInfo.length === 0) {
    return <PageNotFound />;
  }

  let { data: landInfos } = await supabase
    .from("land_info")
    .select("*,author: profiles(*)")
    .eq("id", landId);

  if (!landInfos || landInfos.length === 0) {
    return <PageNotFound />;
  }
  const landInfo = landInfos[0];

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
    <div className="flex relative w-full h-full overflow-hidden">
      <MenuLeft>
        <LandInfoMenu landInfo={landInfo} menuactive="editor" />
      </MenuLeft>
      <div className="w-full max-h-screen h-full overflow-y-auto inline-block text-center justify-center bg-[#f3f6f8]">
        <EditMapIndex
          initData={pixelBlocks}
          initLandInfo={landInfo}
          session={session}
        />
      </div>
    </div>
  );
}

function PageNotFound() {
  return (
    <div className="w-full p-4 text-center flex flex-col items-center justify-center">
      <h1>Page Not Found</h1>
      <p>The page you requested could not be found.</p>
      <Link href="/" className="text-blue-500">
        Back to Home
      </Link>
    </div>
  );
}
