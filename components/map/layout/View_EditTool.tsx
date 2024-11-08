import React from "react";
import { NumInput } from "@/components/utils/NumInput";
import { Select } from "@/components/utils/DLCModule";
import styles from "@/styles/canvas/ViewEditTool.module.css";
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

  return (
    <div
      tabIndex={-1} // 使元素可以聚焦
      style={{ outline: "none" }}
      className={styles["edit-view"]}
    >
      <div className="flex gap-1 justify-between items-center w-full">
        <div className="flex">
          <div className="flex gap-1 justify-between items-center mx-2 w-[150px]">
            <ColorPicker
              className="p-1"
              label={<TbPalette size={20} />}
              value={toolInfo.editColor}
              onChange={(e) => setToolInfo("editColor", e.target.value)}
            />
          </div>
          <div className="flex justify-between items-center mx-2">
            <div className="flex gap-1 justify-between items-center">
              <TbResize size={20} />
              BrushSize：
            </div>
            <div className="flex gap-1 justify-between items-center bg-[#f3f6f8] rounded-[8px] py-[6px]">
              <NumInput
                value={toolInfo.brushSize}
                onUpdate={(value) => {
                  setToolInfo("brushSize", value);
                }}
                precision={0}
                prefix={`${toolInfo.brushSize}x`}
                suffix={
                  <div className="flex items-center text-[10px] ml-4 gap-1">
                    <span
                      style={{
                        letterSpacing: "1px",
                        color:
                          toolInfo.brushSize * toolInfo.brushSize >
                          landInfo.capacity_size - landInfo.used_pixel_blocks
                            ? "#C20E4D" // Warning color
                            : "black", // Default color
                      }}
                    >
                      {toolInfo.brushSize * toolInfo.brushSize}/
                      {landInfo.capacity_size - landInfo.used_pixel_blocks}
                    </span>
                    <LiLandsBoxSvg width={12} height={12} />
                  </div>
                }
                maxValue={10}
                minValue={1}
              />
            </div>
          </div>

          <div className="flex justify-between items-center mx-2">
            <div className="flex gap-1 justify-between items-center">
              类型：
            </div>
            <div className="flex gap-1 justify-between items-center w-[150px]">
              <Select
                aria-label="type_select"
                options={LAND_TYPE}
                value={
                  LAND_TYPE.some(
                    (option) => option.key === toolInfo?.type?.toString()
                  )
                    ? toolInfo.type.toString()
                    : LAND_TYPE[0].key
                }
                onChange={(v) => setToolInfo("type", v)}
              />
            </div>
          </div>

          <div className="flex justify-between items-center mx-2">
            <div className="flex gap-1 justify-between items-center">
              状态：
            </div>
            <div className="flex gap-1 justify-between items-center w-[150px]">
              <NextSelect
                aria-label="status_select"
                items={OPTION_TEST_LIST4}
                classNames={{
                  base: "shadow-none p-1",
                  trigger: "shadow-none bg-[#f3f6f8]",
                }}
                onChange={(v) => {
                  setToolInfo("status", v.target.value);
                }}
                key={toolInfo.status?.toString()}
                defaultSelectedKeys={[toolInfo.status?.toString()]}
                placeholder="请选择"
                labelPlacement="outside"
                size="sm"
                listboxProps={{
                  itemClasses: {
                    base: [
                      "rounded-md",
                      "text-default-500",
                      "transition-opacity",
                      "data-[hover=true]:text-foreground",
                      "data-[hover=true]:bg-default-100",
                      "dark:data-[hover=true]:bg-default-50",
                      "data-[selectable=true]:focus:bg-default-50",
                      "data-[pressed=true]:opacity-70",
                      "data-[focus-visible=true]:ring-default-500",
                    ],
                  },
                }}
                popoverProps={{
                  classNames: {
                    base: "before:bg-default-200",
                    content: "p-0 border-small border-divider bg-background",
                  },
                }}
                renderValue={(items) => {
                  return items.map((item) => (
                    <div key={item.key} className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{
                          backgroundColor: item.data?.color || "#272727",
                        }}
                      />
                      <div className="flex flex-col">
                        <span>{item.data?.label}</span>
                      </div>
                    </div>
                  ));
                }}
              >
                {(item) => (
                  <SelectItem
                    key={item.key}
                    textValue={item.label}
                    value={item.key}
                  >
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
                )}
              </NextSelect>
            </div>
          </div>
        </div>

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
