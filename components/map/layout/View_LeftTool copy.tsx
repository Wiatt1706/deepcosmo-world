// pages/NewMapPage.tsx
"use client";
import styles from "@/styles/canvas/ViewLeftTool.module.css";
import { RadioGroup, cn } from "@nextui-org/react";
import { TbRefresh } from "react-icons/tb";
import algorithm, { TerrainType } from "../helpers/algorithm";
import { PixelBlock } from "@/types/MapTypes";
import { useEditMapStore } from "../SocketManager";
import { NumInput } from "@/components/utils/NumInput";
import { CustomRadio } from "@/components/utils/CustomRadio";
import { ColorPicker } from "@/components/utils/ColorPicker";

export default function LeftToolView() {
  const [toolInfo, setToolInfo, pixelBlocks, setPixelBlocks, initData] =
    useEditMapStore((state: any) => [
      state.toolInfo,
      state.setToolInfo,
      state.pixelBlocks,
      state.setPixelBlocks,
      state.initData,
    ]);
  const handleAlgorithmBtn = (minDistance: number) => {
    const initialTerrain = algorithm.TerrainRenderer({
      detail: toolInfo.terrain_detail,
      roughness: toolInfo.terrain_roughness,
      pixelSize: 20,
      terrainType: toolInfo.terrain_type,
      maxPixels: toolInfo.terrain_maxPixels,
    });

    if (!initData) return pixelBlocks;

    // 创建一个Set来存储imageData中的坐标
    const existingCoords = new Set(
      initData.map((coord: PixelBlock) => `${coord.x},${coord.y}`)
    );

    const isFarEnough = (
      coord: PixelBlock,
      data: PixelBlock[],
      distance: number
    ) => {
      return data.every(
        (existingCoord: PixelBlock) =>
          Math.sqrt(
            (coord.x - existingCoord.x) ** 2 + (coord.y - existingCoord.y) ** 2
          ) >= distance
      );
    };

    const filteredTerrain = initialTerrain.filter(
      (coord: PixelBlock) =>
        !existingCoords.has(`${coord.x},${coord.y}`) &&
        isFarEnough(coord, initData, minDistance)
    );

    setPixelBlocks([...initData, ...filteredTerrain]);
  };

  return (
    <div className={styles["left-view"] + " shadow"}>
      <div className={styles["left-tool-box"] + " p-4"}>
        <div className="flex items-center justify-between mb-4">
          <h4>概览</h4>
          <TbRefresh size={18} />
        </div>

        <div className="bg-[#fff] py-4 my-2 w-full">
          <div className="flex items-center justify-center">
            <div className="flex flex-col items-center justify-center w-1/2 text-center ">
              <span>1000</span>
              <span className="text-xs">土块容量</span>
            </div>
            <div className="flex flex-col items-center justify-center w-1/2 text-center ">
              <span>{pixelBlocks.length}</span>
              <span className="text-xs">当前已用</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles["left-tool-box"] + " p-4"}>
        <div className="flex items-center justify-between mb-4">
          <h4>编辑属性</h4>
          <TbRefresh size={18} />
        </div>

        <RadioGroup
          label="type："
          value={toolInfo.model}
          orientation="horizontal"
          size="sm"
          classNames={{
            label: cn(
              "text-[#313b49] text-[14px] font-[500] leading-[1.5] tracking-[0.5px] "
            ),
          }}
          onValueChange={(value: string) => setToolInfo("model", value)}
        >
          <div className="bg-[#fff] rounded-tl-[15px] rounded-tr-[15px]  p-1 w-full flex items-center justify-between">
            <CustomRadio value="OBSERVE">观察</CustomRadio>
            <CustomRadio value="EDIT">画笔</CustomRadio>
          </div>
        </RadioGroup>

        <div className="bg-[#fff] py-4 my-2 w-full rounded-sm">
          <NumInput
            className="mb-4"
            value={toolInfo.pixelSize}
            onUpdate={(value) => {
              setToolInfo("pixelSize", value);
            }}
            prefix="PixelSize"
            maxValue={40}
            minValue={10}
          />

          <NumInput
            className="mb-4"
            value={toolInfo.brushSize}
            onUpdate={(value) => {
              setToolInfo("brushSize", value);
            }}
            prefix="BrushSize"
            maxValue={10}
            minValue={1}
          />

          <NumInput
            value={toolInfo.pixelPadding}
            onUpdate={(value) => {
              setToolInfo("pixelPadding", value);
            }}
            prefix="PixelPadding"
            maxValue={20}
            minValue={-1}
          />
        </div>

        <ColorPicker
          className="bg-[#fff] p-1 text-[#313b49] text-[13px] "
          label="EditColor："
          value={toolInfo.editColor}
          onChange={(e) => setToolInfo("editColor", e.target.value)}
        />
      </div>

      <div className={styles["left-tool-box"] + " p-4"}>
        <div className="flex items-center justify-between mb-4 ">
          <h4>生成地形</h4>
          <TbRefresh size={18} />
        </div>
        <RadioGroup
          label="Type："
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
            <CustomRadio value={TerrainType.ALL}>All</CustomRadio>
            <CustomRadio value={TerrainType.LAND}>Land</CustomRadio>
            <CustomRadio value={TerrainType.OCEAN}>Ocean</CustomRadio>
          </div>
        </RadioGroup>
        <div className="bg-[#fff] py-4 my-2 w-full rounded-sm">
          <NumInput
            className="mb-4"
            value={toolInfo.terrain_detail}
            onUpdate={(value) => {
              setToolInfo("terrain_detail", value);
            }}
            prefix="Detail"
            maxValue={10}
            minValue={1}
          />

          <NumInput
            className="mb-4"
            value={toolInfo.terrain_roughness}
            onUpdate={(value) => {
              setToolInfo("terrain_roughness", value);
            }}
            prefix="Roughness"
            maxValue={10}
            minValue={1}
          />

          <NumInput
            value={toolInfo.terrain_maxPixels}
            onUpdate={(value) => {
              setToolInfo("terrain_maxPixels", value);
            }}
            prefix="MaxPixels"
            maxValue={10000}
            minValue={1000}
          />
        </div>

        <ColorPicker
          className="mb-4 text-[13px] bg-[#fff] p-1 text-[#313b49]"
          label="TerrainColor："
          value={toolInfo.terrain_color}
          onChange={(e) => setToolInfo("terrain_color", e.target.value)}
        />

        <div
          className={
            styles["bottom-tool-box"] +
            " px-[25px] cursor-pointer hover:bg-gray-200"
          }
          onClick={() => handleAlgorithmBtn(40)}
        >
          生成
        </div>
      </div>
    </div>
  );
}
