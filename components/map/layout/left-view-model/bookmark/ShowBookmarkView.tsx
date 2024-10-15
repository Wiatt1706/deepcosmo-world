"use client";
import styles from "@/styles/canvas/ViewLeftTool.module.css";
import { TbArrowLeft, TbLock } from "react-icons/tb";
import { useShowBaseStore } from "@/components/map/layout/ShowMapIndex";
import { PixelBlock } from "@/types/MapTypes";
import { PixelBoxItem } from "../PixelBoxItem";
import { SearchBox } from "../SearchBox";
import { Session } from "@supabase/auth-helpers-nextjs";
import { useUserCustomItemBlock } from "@/components/hook/service/useUserCustomItemBlock";
import { SkeletonLoader } from "@/components/utils/SkeletonLoader";

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
      <div
        className="overflow-y-auto"
        style={{ maxHeight: `calc(100vh - 131px)` }}
      >
        {ShowBookmarkList({
          selectedListId: selectedListObj?.id,
        })}
      </div>
    </div>
  );
}

export function ShowBookmarkList({
  selectedListId,
}: {
  selectedListId?: string;
  endContent?: JSX.Element;
}) {
  const [selectedPixelBlock, setSelectedPixelBlock] = useShowBaseStore(
    (state: any) => [state.selectedPixelBlock, state.setSelectedPixelBlock]
  );

  const { pixelBlocks, loading, error } = useUserCustomItemBlock({
    column: "user_custom_list_id",
    value: selectedListId,
  });

  return (
    <>
      {pixelBlocks?.length === 0 ? (
        <div className="text-[#202124] text-[14px] my-6 px-1 text-center">
          列表为空
        </div>
      ) : (
        <div>
          <div className="d_c_b text-gray-500 text-[12px] m-2 px-1">
            <span>像素块</span>
          </div>
          {pixelBlocks?.map((item: PixelBlock) => {
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
      )}
      {loading && <SkeletonLoader count={3} />}
    </>
  );
}
