import React, { useState } from "react";
import styles from "@/styles/canvas/ViewLeftMenu.module.css";
import { useBaseStore, useEditMapStore } from "@/components/map/SocketManager";
import { TbRefresh } from "react-icons/tb";
import { RadioGroup, Switch, cn } from "@nextui-org/react";
import { CustomRadio } from "@/components/utils/CustomRadio";
import algorithm, { TerrainType } from "@/components/map/helpers/algorithm";
import { NumInput } from "@/components/utils/NumInput";
import { ColorPicker } from "@/components/utils/ColorPicker";
import { PixelBlock } from "@/types/MapTypes";
import { isRectIntersect } from "./Model_Upload";
import { LiLandsBoxSvg } from "@/components/utils/icons";

export default function ModelGenerateLand({
  onClose,
}: {
  onClose: () => void;
}) {
  const [toolInfo, setToolInfo, initData, landInfo] = useBaseStore(
    (state: any) => [
      state.toolInfo,
      state.setToolInfo,
      state.initData,
      state.landInfo,
    ]
  );

  const [pixelBlocks, setPixelBlocks] = useEditMapStore((state: any) => [
    state.pixelBlocks,
    state.setPixelBlocks,
  ]);

  const [useColor, setUseColor] = useState(false);

  const handleMerge = (loadData: PixelBlock[]) => {
    let updatedBlocks = [...pixelBlocks]; // 复制现有的 pixelBlocks
    const intersectingBlocks = new Set<PixelBlock>(); // 存储相交的 pixelBlocks

    // 查找与 loadData 相交的 pixelBlocks
    loadData.forEach((newBlock) => {
      pixelBlocks.forEach((existingBlock: PixelBlock) => {
        if (isRectIntersect(newBlock, existingBlock)) {
          intersectingBlocks.add(newBlock); // 找到相交的 block
        }
      });
    });

    if (intersectingBlocks.size > 0) {
      // 从 pixelBlocks 中删除相交的 blocks
      loadData = loadData.filter((block) => !intersectingBlocks.has(block));
    }

    // 将 loadData 融入到剩余的 pixelBlocks 中
    updatedBlocks = [...pixelBlocks, ...loadData];
    setPixelBlocks(updatedBlocks);
    onClose();
  };

  const handleAlgorithmBtn = (minDistance: number) => {
    const initialTerrain = algorithm.TerrainRenderer({
      detail: toolInfo.terrain_detail,
      roughness: toolInfo.terrain_roughness,
      pixelSize: 20,
      terrainType: toolInfo.terrain_type,
      maxPixels: landInfo.capacity_size - landInfo.used_pixel_blocks,
      terrainColor: useColor ? toolInfo.terrain_color : null,
    });

    handleMerge(initialTerrain);
  };

  return (
    <div className="mb-4">
      <RadioGroup
        label="生成类型："
        value={toolInfo.terrain_type}
        orientation="horizontal"
        size="sm"
        classNames={{
          label: cn(
            "text-[#313b49] text-[14px] font-[500] leading-[1.5] tracking-[0.5px] "
          ),
        }}
        onValueChange={(value: string) => setToolInfo("terrain_type", value)}
      >
        <div className="bg-[#fff] rounded-tl-[15px] rounded-tr-[15px] p-1 w-full flex items-center justify-between">
          <CustomRadio value={TerrainType.LAND}>Land</CustomRadio>
          <CustomRadio value={TerrainType.OCEAN}>Ocean</CustomRadio>
          <CustomRadio value={TerrainType.ALL}>All</CustomRadio>
        </div>
      </RadioGroup>
      <div className="bg-[#fff] py-4 my-2 w-full rounded-sm">
        <NumInput
          className="mb-4"
          value={toolInfo.terrain_detail}
          onUpdate={(value) => {
            setToolInfo("terrain_detail", value);
          }}
          prefix="细节"
          maxValue={10}
          minValue={1}
        />

        <NumInput
          className="mb-4"
          value={toolInfo.terrain_roughness}
          onUpdate={(value) => {
            setToolInfo("terrain_roughness", value);
          }}
          prefix="粗糙度"
          maxValue={10}
          minValue={1}
        />

        <div className="w-full pb-2">
          <div className="flex items-center justify-between w-full my-2    ">
            <span className="text-sm ml-4">控制颜色</span>

            <Switch
              defaultSelected={useColor}
              onValueChange={(v) => setUseColor(v)}
            />
          </div>
          {useColor && (
            <div className=" ml-2 ">
              <ColorPicker
                className="mb-4 text-[13px] bg-[#fff] p-1 text-[#313b49]"
                label="TerrainColor："
                value={toolInfo.terrain_color}
                onChange={(e) => setToolInfo("terrain_color", e.target.value)}
              />
            </div>
          )}
        </div>
        <NumInput
          value={landInfo.capacity_size - landInfo.used_pixel_blocks}
          onUpdate={(value) => {
            setToolInfo("terrain_maxPixels", value);
          }}
          readOnly
          prefix="生成像素块"
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
                当前可用
              </span>
              <LiLandsBoxSvg width={12} height={12} />
            </div>
          }
          maxValue={10000}
          minValue={1000}
        />
      </div>

      <div
        className={
          styles["bottom-tool-box"] +
          " px-[25px]  cursor-pointer hover:bg-gray-200"
        }
        onClick={() => handleAlgorithmBtn(40)}
      >
        生成
      </div>
    </div>
  );
}
