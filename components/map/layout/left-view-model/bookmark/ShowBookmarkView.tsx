"use client";
import { useEffect, useState } from "react";
import styles from "@/styles/canvas/ViewLeftTool.module.css";
import { TbArrowLeft, TbLock } from "react-icons/tb";
import { useShowBaseStore } from "@/components/map/layout/ShowMapIndex";
import { PixelBlock } from "@/types/MapTypes";
import { PixelBoxItem } from "../PixelBoxItem";
import { SearchBox } from "../SearchBox";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"; // Assuming you're using Supabase
import { Session } from "@supabase/auth-helpers-nextjs";

export default function ShowBookmarkView({
  session,
}: {
  session?: Session | null;
}) {
  const [setIsLeftAct, selectedListObj, setSelectedModule] = useShowBaseStore(
    (state: any) => [
      state.setIsLeftAct,
      state.selectedListObj,
      state.setSelectedModule,
    ]
  );

  return (
    <div className={styles["columnGgroup"]}>
      <SearchBox
        startContent={
          <div
            onClick={() => setSelectedModule("Bookmark")}
            className="p-2 hover:text-blue-500 cursor-pointer"
          >
            <TbArrowLeft size={22} strokeWidth={2.3} />
          </div>
        }
        setIsAct={setIsLeftAct}
      />
      <h2 className="flex items-center px-6 ">{selectedListObj?.name}</h2>
      <div className="mb-2 px-6 flex items-center text-[12px] text-gray-500">
        <TbLock />
        <span className="ml-1 ">不公开</span>
      </div>
      <hr />
      {ShowBookmarkList({
        selectedListId: selectedListObj?.id,
        session: session,
      })}
    </div>
  );
}

export function ShowBookmarkList({
  selectedListId,
  session,
}: {
  selectedListId: string;
  session?: Session | null;
}) {
  const supabase = createClientComponentClient();
  const [selectedPixelBlock, setSelectedPixelBlock] = useShowBaseStore(
    (state: any) => [state.selectedPixelBlock, state.setSelectedPixelBlock]
  );

  const [queryPixelBlock, setQueryPixelBlock] = useState<PixelBlock[]>();

  // Fetch UserCustomItem data when selectedListObj changes
  useEffect(() => {
    if (!selectedListId) return;

    const fetchPixelBlocks = async () => {
      try {
        const { data, error } = await supabase
          .from("UserCustomItem") // Replace with your actual table name
          .select(
            "land_info(id,land_name,world_coordinates_x,world_coordinates_y,world_size_x,world_size_y,fill_color,border_size,block_count,land_type,land_status,cover_icon_url)"
          ) // Assuming you have a 'pixel_blocks' field
          .eq("user_custom_list_id", selectedListId); // Assuming `selectedListObj.id` links to the correct records

        if (error) {
          console.error("Error fetching pixel blocks:", error);
          return;
        }

        if (data) {
          const pixelBlocks: PixelBlock[] =
            data?.map((requestDTO: any) => {
              return {
                id: requestDTO.land_info.id,
                name: requestDTO.land_info.land_name,
                x: requestDTO.land_info.world_coordinates_x,
                y: requestDTO.land_info.world_coordinates_y,
                width: requestDTO.land_info.world_size_x,
                height: requestDTO.land_info.world_size_y,
                color: requestDTO.land_info.fill_color,
                borderSize: requestDTO.land_info.border_size,
                blockCount: requestDTO.land_info.block_count,
                type: parseInt(requestDTO.land_info.land_type),
                status: parseInt(requestDTO.land_info.land_status),
                landCoverImg: requestDTO.land_info.cover_icon_url, // 如果没有封面图片，则设置为undefined
              } as PixelBlock;
            }) || [];
          setQueryPixelBlock(pixelBlocks); // Update the state with fetched data
        }
      } catch (err) {
        console.error("Error fetching pixel blocks:", err);
      }
    };

    fetchPixelBlocks();
  }, [selectedListId, supabase]);

  return (
    <div
      className="overflow-y-auto"
      style={{ maxHeight: `calc(100vh - 131px)` }}
    >
      <div className="d_c_b text-gray-500 text-[12px] m-2 px-1">
        <span>像素块</span>
      </div>
      {queryPixelBlock?.map((item: PixelBlock) => {
        const key = item.id;
        return (
          <PixelBoxItem
            key={key}
            item={item}
            selected={selectedPixelBlock?.id === key}
            hovered={true}
            onClick={() => setSelectedPixelBlock(item)}
          />
        );
      })}
    </div>
  );
}
