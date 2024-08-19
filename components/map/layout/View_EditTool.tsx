import React from "react";
import { NumInput } from "@/components/utils/NumInput";
import styles from "@/styles/canvas/ViewEditTool.module.css";
import { useBaseStore, temporalEditMapStore } from "../SocketManager";
import { ColorPicker } from "@/components/utils/ColorPicker";
import {
  TbArrowBackUp,
  TbArrowForwardUp,
  TbPalette,
  TbResize,
} from "react-icons/tb";
import { LiLandsBoxSvg } from "@/components/utils/icons";

export default function EditToolView() {
  const [toolInfo, landInfo, setToolInfo] = useBaseStore((state: any) => [
    state.toolInfo,
    state.landInfo,
    state.setToolInfo,
  ]);

  const { undo, redo } = temporalEditMapStore((state: any) => ({
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
            <div className="flex gap-1 justify-between items-center bg-[#f3f6f8] rounded-[8px] py-1">
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
