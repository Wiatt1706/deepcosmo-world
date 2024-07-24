// pages/NewMapPage.tsx
"use client";
import { NumInput } from "@/components/utils/NumInput";
import styles from "@/styles/canvas/ViewEditTool.module.css";
import { Slider } from "@nextui-org/react";
import { useEditMapStore } from "../SocketManager";
import { ColorPicker } from "@/components/utils/ColorPicker";
import { TbBoxPadding, TbPalette, TbResize } from "react-icons/tb";

export default function EditToolView() {
  const [toolInfo, setToolInfo, pixelBlocks, setPixelBlocks, initData] =
    useEditMapStore((state: any) => [
      state.toolInfo,
      state.setToolInfo,
      state.pixelBlocks,
      state.setPixelBlocks,
      state.initData,
    ]);

  return (
    <div className={styles["edit-view"]}>
      <div className="flex gap-1 justify-between items-center mx-2 w-[150px]">
        <ColorPicker
          className="p-1"
          label={<TbPalette size={20} />}
          value={toolInfo.editColor}
          onChange={(e) => setToolInfo("editColor", e.target.value)}
        />
      </div>
      <div className="flex gap-1 justify-between items-center mx-2">
        <div className="flex gap-1 justify-between items-center">
          <TbResize size={20} />
          BrushSize：
        </div>

        <NumInput
          value={toolInfo.brushSize}
          onUpdate={(value) => {
            setToolInfo("brushSize", value);
          }}
          maxValue={10}
          minValue={1}
        />
      </div>
    </div>
  );
}
