"use client";
import styles from "@/styles/canvas/ViewLeftTool.module.css";
import { Button, ScrollShadow } from "@nextui-org/react";
import { Key, useState } from "react";
import {
  TbBookmarkFilled,
  TbCheck,
  TbInfoCircle,
  TbMapPin,
  TbShare,
  TbSquare,
  TbSquareCheckFilled,
} from "react-icons/tb";
import { PixelBlock } from "@/types/MapTypes";
import { useShowBaseStore } from "@/components/map/layout/ShowMapIndex";
import { PixelBoxItem } from "./PixelBoxItem";
import { SearchBox } from "./SearchBox";

export default function HistoryView({
  setIsAct,
}: {
  setIsAct: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [typeSelectedValue, setTypeSelectedValue] = useState("all"); // 默认选中的值
  const [selectedPixelBlock, setSelectedPixelBlock, lastListPixelBlock] =
    useShowBaseStore((state: any) => [
      state.selectedPixelBlock,
      state.setSelectedPixelBlock,
      state.lastListPixelBlock,
    ]);

  const [selectedKeys, setSelectedKeys] = useState<Set<Key>>(new Set());
  const [areAllSelected, setAreAllSelected] = useState(false); // Track if all are selected
  const [hoveredKey, setHoveredKey] = useState<string | null>(null); // Track hovered item

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
        (item: PixelBlock) => item.id
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
            const key = item.id; // Correctly form the key
            const isSelected = selectedKeys.has(key); // Check if selected
            const isHovered = hoveredKey === key; // Check if hovered
            return (
              <PixelBoxItem
                key={key}
                item={item}
                selected={selectedPixelBlock?.id === key}
                hovered={isHovered || isSelected}
                onClick={() => setSelectedPixelBlock(item)}
                onHover={setHoveredKey}
                endContent={
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleSelection(key);
                    }}
                    className="cursor-pointer h-[60px] px-2 d_c_c"
                  >
                    {isSelected ? (
                      <TbSquareCheckFilled color="#006fef" size={20} />
                    ) : (
                      <TbSquare size={20} />
                    )}
                  </div>
                }
              />
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
