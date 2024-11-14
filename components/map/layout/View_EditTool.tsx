import React from "react";
import { NumInput } from "@/components/utils/NumInput";
import { Select } from "@/components/utils/DLCModule";
import { useBaseStore, useTemporalEditMapStore } from "../SocketManager";
import { ColorPicker } from "@/components/utils/ColorPicker";
import { Select as NextSelect, SelectItem } from "@nextui-org/react";
import {
  TbArrowBackUp,
  TbArrowForwardUp,
  TbPalette,
  TbResize,
} from "react-icons/tb";
import { LiLandsBoxSvg } from "@/components/utils/icons";
import { LAND_TYPE, OPTION_TEST_LIST4 } from "@/types/MapTypes";
import styles from "@/styles/canvas/ViewEditTool.module.css";

export default function EditToolView() {
  const [toolInfo, landInfo, setToolInfo] = useBaseStore((state: any) => [
    state.toolInfo,
    state.landInfo,
    state.setToolInfo,
  ]);

  const { undo, redo } = useTemporalEditMapStore((state: any) => ({
    undo: state.undo,
    redo: state.redo,
  }));

  // 解构提取所需的字段
  const { brushSize, editColor, type, status } = toolInfo ?? {};
  const { capacity_size = 0, used_pixel_blocks = 0 } = landInfo ?? {};
  const remainingCapacity = capacity_size - used_pixel_blocks;

  // 处理工具信息更新
  const handleToolInfoUpdate = (key: string, value: any) =>
    setToolInfo(key, value);

  // 选择框值渲染函数
  const renderSelectItem = (item: any) => (
    <SelectItem key={item.key} textValue={item.label} value={item.key}>
      <div className="flex gap-2 items-center">
        <div
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: item?.color || "#272727" }}
        />
        <div className="flex flex-col">
          <span className="text-small">{item.label}</span>
        </div>
      </div>
    </SelectItem>
  );

  return (
    <div
      tabIndex={-1}
      style={{ outline: "none" }}
      className={styles["edit-view"]}
    >
      <div className="flex gap-1 justify-between items-center w-full">
        {/* 颜色选择 */}
        <div className="flex gap-1 justify-between items-center mx-2 w-[150px]">
          <ColorPicker
            className="p-1"
            label={<TbPalette size={20} />}
            value={editColor}
            onChange={(e) => handleToolInfoUpdate("editColor", e.target.value)}
          />
        </div>

        {/* 刷新大小 */}
        <div className="flex justify-between items-center mx-2">
          <div className="flex gap-1 justify-between items-center">
            <TbResize size={20} />
            BrushSize：
          </div>
          <div className="flex gap-1 justify-between items-center bg-[#f3f6f8] rounded-[8px] py-[6px]">
            <NumInput
              value={brushSize}
              onUpdate={(value) => handleToolInfoUpdate("brushSize", value)}
              precision={0}
              prefix={`${brushSize}x`}
              suffix={
                <div className="flex items-center text-[10px] ml-4 gap-1">
                  <span
                    style={{
                      letterSpacing: "1px",
                      color:
                        brushSize * brushSize > remainingCapacity
                          ? "#C20E4D"
                          : "black",
                    }}
                  >
                    {brushSize * brushSize}/{remainingCapacity}
                  </span>
                  <LiLandsBoxSvg width={12} height={12} />
                </div>
              }
              maxValue={10}
              minValue={1}
            />
          </div>
        </div>

        {/* 类型选择 */}
        <div className="flex justify-between items-center mx-2">
          <div className="flex gap-1 justify-between items-center">类型：</div>
          <div className="flex gap-1 justify-between items-center w-[150px]">
            <Select
              aria-label="type_select"
              options={LAND_TYPE}
              value={
                LAND_TYPE.find((option) => option.key === type?.toString())
                  ?.key ?? LAND_TYPE[0].key
              }
              onChange={(v) => handleToolInfoUpdate("type", v)}
            />
          </div>
        </div>

        {/* 状态选择 */}
        <div className="flex justify-between items-center mx-2">
          <div className="flex gap-1 justify-between items-center">状态：</div>
          <div className="flex gap-1 justify-between items-center w-[150px]">
            <NextSelect
              aria-label="status_select"
              items={OPTION_TEST_LIST4}
              classNames={{
                base: "shadow-none p-1",
                trigger: "shadow-none bg-[#f3f6f8]",
              }}
              onChange={(v) => handleToolInfoUpdate("status", v.target.value)}
              defaultSelectedKeys={[status?.toString()]}
              placeholder="请选择"
              labelPlacement="outside"
              size="sm"
              listboxProps={{
                itemClasses: {
                  base: "rounded-md text-default-500 transition-opacity",
                  title: "text-lg font-semibold", // 如果需要可以添加其他键
                  description: "text-sm text-gray-600",
                  wrapper: "p-2",
                  selectedIcon: "text-primary-500",
                  shortcut: "text-xs text-gray-500",
                },
              }}
              popoverProps={{
                classNames: {
                  base: "before:bg-default-200",
                  content: "p-0 border-small border-divider bg-background",
                },
              }}
              renderValue={(items) =>
                items.map((item) => (
                  <div key={item.key} className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.data?.color || "#272727" }}
                    />
                    <div className="flex flex-col">
                      <span>{item.data?.label}</span>
                    </div>
                  </div>
                ))
              }
            >
              {renderSelectItem}
            </NextSelect>
          </div>
        </div>

        {/* 撤销和重做按钮 */}
        <div className="flex items-center px-4">
          <div
            onClick={() => undo()}
            className="flex items-center justify-center w-[38px] h-[38px] rounded-full hover:bg-[#f3f6f8] text-[#4c5863] mr-1"
          >
            <TbArrowBackUp size={24} strokeWidth={1.1} />
          </div>
          <div
            onClick={() => redo()}
            className="flex items-center justify-center w-[38px] h-[38px] rounded-full hover:bg-[#f3f6f8] text-[#4c5863]"
          >
            <TbArrowForwardUp size={24} strokeWidth={1.1} />
          </div>
        </div>
      </div>
    </div>
  );
}
