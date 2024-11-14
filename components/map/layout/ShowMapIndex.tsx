"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { PixelBlock } from "@/types/MapTypes";
import LeftInfoView from "./left-view-model/View_LeftInfo";
import ShowMapCanvas from "../ShowMapCanvas";
import CanavsToolView from "./View_CanvasTool";
import { useAtomValue, useSetAtom } from "jotai";
import {
  isLeftActAtom,
  loadDataAtom,
  selectedModuleAtom,
} from "../store/ShowBaseAtomStore";
import {
  Session,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { Spinner } from "@nextui-org/react";

export default function ShowMapIndex({
  session,
  landInfo,
  loadScale,
  loadX,
  loadY,
}: {
  session: Session | null;
  landInfo: Land;
  loadScale?: number;
  loadX?: number;
  loadY?: number;
}) {
  const supabase = createClientComponentClient<Database>();
  const prevLandInfoIdRef = useRef<string | undefined>(undefined);

  const [isRightMenu, setIsRightMenu] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(true); // 跟踪加载状态

  const setLoadData = useSetAtom(loadDataAtom);
  const setSelectedModule = useSetAtom(selectedModuleAtom);
  const isLeftAct = useAtomValue(isLeftActAtom);

  const handleLoadData = useCallback(async () => {
    setIsLoading(true);
    let { data: requestDTOs } = await supabase
      .from("land_info")
      .select(
        "id,land_name,world_coordinates_x,world_coordinates_y,world_size_x,world_size_y,fill_color,border_size,block_count,land_type,land_status,cover_icon_url,land_owner"
      )
      .eq("parent_land_id", landInfo.id);

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
          owner: requestDTO.land_owner, // 如果没有封面图片，则设置为undefined
        } as PixelBlock;
      }) || [];

    setLoadData(pixelBlocks || []);
    setIsLoading(false);
  }, [supabase, setLoadData, landInfo]);

  useEffect(() => {
    if (landInfo && landInfo.id && prevLandInfoIdRef.current !== landInfo.id) {
      handleLoadData();
      prevLandInfoIdRef.current = landInfo.id; // 更新 ref，避免重复调用
    }
  }, [landInfo, handleLoadData]);

  useEffect(() => {
    if (!isLeftAct) {
      setSelectedModule("");
    }
  }, [isLeftAct]);

  return (
    <>
      <div
        className={`h-full absolute right-0 ${
          isRightMenu
            ? isLeftAct
              ? "w-[calc(100%-424px)]"
              : "w-[calc(100%-64px)]"
            : "w-full"
        }`}
      >
        {!isLoading ? (
          <>
            <LeftInfoView session={session} />
            <CanavsToolView session={session} landInfo={landInfo} />
            <ShowMapCanvas loadScale={loadScale} loadX={loadX} loadY={loadY} />
          </>
        ) : (
          <div className="w-full h-full d_c_c_c">
            <Spinner label="Loading..." />
          </div>
        )}
      </div>
    </>
  );
}
