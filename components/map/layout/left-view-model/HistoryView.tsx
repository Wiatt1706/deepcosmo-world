"use client";
import styles from "@/styles/canvas/ViewLeftTool.module.css";
import { Button, Image, ScrollShadow } from "@nextui-org/react";
import { Listbox, ListboxItem } from "@nextui-org/react";
import { Key, useMemo, useState } from "react";
import {
  TbBookmark,
  TbBookmarkFilled,
  TbCheck,
  TbInfoCircle,
  TbMapPin,
  TbSearch,
  TbShare,
  TbSquare,
  TbSquareCheck,
  TbSquareCheckFilled,
  TbX,
} from "react-icons/tb";
import { useShowBaseStore } from "../ShowMapIndex";
import { PixelBlock } from "@/types/MapTypes";

export const SearchBox = ({
  setIsAct,
}: {
  setIsAct: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div className="p-4 w-full h-[80px]">
      <div
        className={
          styles["searchBox"] +
          " w-full border rounded-[48px] flex items-center text-[#70757A]"
        }
      >
        <input
          type="text"
          placeholder="搜索历史记录"
          className="w-full text-[14px] rounded-[48px] focus:outline-none pl-4"
        />
        <div className="p-3 rounded-full hover:text-[#0070f0] cursor-pointer">
          <TbSearch size={21} strokeWidth={2.3} />
        </div>
        <div
          onClick={() => setIsAct(false)}
          className="w-[68px] h-[48px] d_c_c rounded-full hover:text-[#0070f0] cursor-pointer"
        >
          <TbX size={21} strokeWidth={2.3} />
        </div>
      </div>
    </div>
  );
};
export default function HistoryView({
  setIsAct,
}: {
  setIsAct: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [typeSelectedValue, setTypeSelectedValue] = useState("all"); // 默认选中的值
  const [lastListPixelBlock] = useShowBaseStore((state: any) => [
    state.lastListPixelBlock,
  ]);

  const [selectedKeys, setSelectedKeys] = useState<Set<Key>>(new Set());
  const [clickedItem, setClickedItem] = useState<string | null>(null); // Track the clicked item
  const [areAllSelected, setAreAllSelected] = useState(false); // Track if all are selected

  const options = [
    { value: "all", label: "全部", icon: null },
    { value: "netrue", label: "Neture", icon: <TbMapPin /> },
  ];

  const handleSelect = (value: string) => {
    setTypeSelectedValue(value);
  };

  const handleToggleSelectAll = () => {
    if (areAllSelected) {
      setSelectedKeys(new Set()); // Deselect all
    } else {
      const allKeys = Array.from(lastListPixelBlock as Set<PixelBlock>).map(
        (item: PixelBlock) => item.x + "_" + item.y
      );
      setSelectedKeys(new Set(allKeys)); // Select all
    }
    setAreAllSelected(!areAllSelected); // Toggle the state
  };

  const handleToggleSelection = (key: string) => {
    const newSelectedKeys = new Set(selectedKeys);
    if (newSelectedKeys.has(key)) {
      newSelectedKeys.delete(key); // Deselect if already selected
    } else {
      newSelectedKeys.add(key); // Select if not already selected
    }
    setSelectedKeys(newSelectedKeys); // Update the state
  };

  // Check if any items are selected
  const isAnySelected = selectedKeys.size > 0;

  return (
    <div className={styles["columnGgroup"]}>
      <SearchBox setIsAct={setIsAct} />
      <h2 className="flex items-center px-6 h-[32px]">
        最近
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent the event from bubbling up
          }}
          className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-[#e8ebeb] focus:outline-none"
        >
          <TbInfoCircle />
        </button>
      </h2>

      <ScrollShadow hideScrollBar orientation="horizontal">
        <div className="flex gap-2 px-6 py-6 h-[80px]">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`flex items-center gap-2 border px-3 py-1 rounded cursor-pointer ${
                typeSelectedValue === option.value
                  ? "border-[#d2e3fc] text-[#1967d2] bg-[#e8f0fe]"
                  : ""
              }`}
            >
              {typeSelectedValue === option.value ? (
                <TbCheck /> // 使用选中状态的图标
              ) : (
                option.icon // 默认图标
              )}
              <span className="text-[14px] whitespace-nowrap">
                {option.label}
              </span>
            </div>
          ))}
        </div>
      </ScrollShadow>

      <hr />

      <div
        className="overflow-y-auto"
        style={{ maxHeight: `calc(100vh - 260px)` }}
      >
        {Array.from(lastListPixelBlock as Set<PixelBlock>).map(
          (item: PixelBlock) => {
            const key = `${item.x}_${item.y}`; // Correctly form the key
            const isSelected = selectedKeys.has(key); // Check if selected

            return (
              <div
                key={key}
                className={`flex items-center justify-between p-2 rounded m-2 ${
                  clickedItem === key ? "bg-[#e7e8e8]" : "hover:bg-[#e8ebeb]"
                } cursor-pointer`}
                onClick={() => setClickedItem(key)}
              >
                <div className="flex items-center text-[14px]">
                  <div className="min-w-[64px] min-h-[64px] max-w-[64px] max-h-[64px] border border hover:border-[#006fef] p-1 m-1 overflow-hidden">
                    <Image
                      width={64}
                      height={64}
                      alt="Pixel block Image"
                      src={item.landCoverImg || "/images/DefPixel.png"} // 使用默认图片
                      className="object-cover rounded-sm"
                    />
                  </div>
                  <div className="flex flex-col h-[60px] px-2 ">
                    <span className="text-[16px] font-semibold">
                      {item.x}，{item.y}
                    </span>
                    <span>像素块</span>
                  </div>
                </div>
                <div
                  onClick={() => handleToggleSelection(key)} // Handle selection toggle
                  className="cursor-pointer h-[60px] px-4 d_c_c"
                >
                  {isSelected ? (
                    <TbSquareCheckFilled color="#006fef" size={20} />
                  ) : (
                    <TbSquare size={20} />
                  )}
                </div>
              </div>
            );
          }
        )}
      </div>

      <div className="w-full h-[68px] border-t absolute bottom-0 flex items-center justify-between px-4">
        <div
          className={`d_c_c gap-2 ${
            isAnySelected ? "" : "opacity-50 pointer-events-none"
          }`}
        >
          <Button
            radius="full"
            color="primary"
            size="sm"
            startContent={<TbBookmarkFilled size={16} strokeWidth={1.5} />}
            className="px-4 text-[14px] h-[36px]"
            disabled={!isAnySelected} // Disable when no items are selected
          >
            保存
          </Button>

          <div
            className={`w-[36px] h-[36px] d_c_c border rounded-full text-[#1967d2] ${
              isAnySelected
                ? "hover:bg-[#e8f0fe]"
                : "opacity-50 pointer-events-none"
            }`}
          >
            <TbShare size={16} strokeWidth={1.5} />
          </div>
        </div>
        <Button
          variant="light"
          color="primary"
          size="sm"
          className={`${areAllSelected ? "" : ""} text-[14px]`}
          onClick={handleToggleSelectAll}
        >
          {areAllSelected ? "取消全选" : "全选"}
        </Button>
      </div>
    </div>
  );
}
