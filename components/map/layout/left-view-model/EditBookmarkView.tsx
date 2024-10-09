"use client";
import styles from "@/styles/canvas/ViewLeftTool.module.css";
import { SearchBox } from "./HistoryView";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Textarea,
} from "@nextui-org/react";
import { TbArrowLeft, TbDotsVertical, TbLock, TbPlus } from "react-icons/tb";
import { useShowBaseStore } from "@/components/map/layout/ShowMapIndex";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { PixelBlock } from "@/types/MapTypes";
import { PixelBoxItem } from "./PixelBoxItem";

export default function EditBookmarkView() {
  const supabase = createClientComponentClient<Database>();

  const [
    setIsLeftAct,
    selectedListObj,
    setSelectedModule,
    selectedPixelBlock,
    setSelectedPixelBlock,
    lastListPixelBlock,
  ] = useShowBaseStore((state: any) => [
    state.setIsLeftAct,
    state.selectedListObj,
    state.setSelectedModule,
    state.selectedPixelBlock,
    state.setSelectedPixelBlock,
    state.lastListPixelBlock,
  ]);

  return (
    <div className={styles["columnGgroup"]}>
      <SearchBox
        startContent={
          <div
            onClick={() => setSelectedModule("Bookmark")}
            className="w-[48px] h-[48px] pl-2 d_c_c rounded-full hover:text-[#0070f0] cursor-pointer"
          >
            <TbArrowLeft size={22} strokeWidth={2.3} />
          </div>
        }
        setIsAct={setIsLeftAct}
      />
      <h2 className="flex items-center px-6 ">修改列表</h2>
      <div className="mb-2 px-6 flex items-center text-[12px] text-gray-500">
        <TbLock />
        <span className="ml-1 ">不公开</span>
      </div>
      <hr />
      <div
        className="overflow-y-auto"
        style={{ maxHeight: `calc(100vh - 132px)` }}
      >
        {selectedListObj.type === 2 && (
          <div className="p-6">
            <div className="d_c_b text-gray-500 text-[12px] mb-1 px-1">
              <span>列表名称</span>
              <span>0/40</span>
            </div>
            <Input
              variant="bordered"
              defaultValue={selectedListObj.name}
              radius="none"
              placeholder="请输入列表名称"
              labelPlacement="outside"
            />

            <div className="d_c_b text-gray-500 text-[12px] mb-1 px-1 mt-6">
              <span>列表说明</span>
              <span>0/400</span>
            </div>
            <Textarea
              variant="bordered"
              defaultValue={selectedListObj.describe}
              labelPlacement="outside"
              radius="none"
            />
          </div>
        )}

        <hr />
        <div className="d_c_b text-gray-500 text-[12px] m-2 px-1">
          <span>像素块</span>
          <Button
            variant="light"
            size="sm"
            startContent={
              <TbPlus
                size={18}
                strokeWidth={3.3}
                className="text-[#0070f0] cursor-pointer"
              />
            }
          >
            <span className="ml-1">添加块</span>
          </Button>
        </div>
        {Array.from(lastListPixelBlock as Set<PixelBlock>).map(
          (item: PixelBlock) => {
            const key = item.id; // Correctly form the key
            return (
              <PixelBoxItem
                key={key}
                item={item}
                selected={selectedPixelBlock?.id === key}
                hovered={true}
                onClick={() => setSelectedPixelBlock(item)}
                endContent={
                  <Dropdown radius="sm">
                    <DropdownTrigger>
                      <button className="flex items-center justify-center w-[42px] h-[42px] rounded-full hover:bg-[#e8ebeb] focus:outline-none">
                        <TbDotsVertical />
                      </button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Static Actions" variant="faded">
                      <DropdownItem key="share">分享列表</DropdownItem>
                      <DropdownItem
                        key="delete"
                        className="text-danger"
                        color="danger"
                      >
                        删除列表
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                }
              />
            );
          }
        )}
      </div>
    </div>
  );
}
