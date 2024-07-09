// pages/NewMapPage.tsx
"use client";
import styles from "@/styles/canvas/ViewLeftTool.module.css";
import {
  Button,
  ButtonGroup,
  RadioGroup,
  RadioProps,
  Slider,
  VisuallyHidden,
  cn,
  useRadio,
} from "@nextui-org/react";
import { useState } from "react";
import { TbRefresh } from "react-icons/tb";
import algorithm, { TerrainType } from "../helpers/algorithm";
import { temporal } from "zundo";
import { create } from "zustand";
import { PixelBlock } from "@/types/MapTypes";
import { useEditMapStore } from "../SocketManager";

export const CustomRadio = (props: RadioProps) => {
  const {
    Component,
    children,
    isSelected,
    description,
    getBaseProps,
    getWrapperProps,
    getInputProps,
    getLabelProps,
    getLabelWrapperProps,
    getControlProps,
  } = useRadio(props);

  return (
    <Component
      {...getBaseProps()}
      className={cn(
        " text-[#707987] text-[14px] font-[500] leading-[1.5] tracking-[0.5px] inline-flex items-center hover:bg-[#f8fafc] hover:text-[#242424] ",
        "max-w-[300px] cursor-pointer  rounded-[50px] px-4 py-1",
        "data-[selected=true]:bg-[#f8fafc] data-[selected=true]:text-[#242424]"
      )}
    >
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>

      <div {...getLabelWrapperProps()}>
        {children && <span>{children}</span>}
      </div>
    </Component>
  );
};

export default function LeftToolView() {
  const [terrainInfo, setTerrainInfo, pixelBlocks, setPixelBlocks, initData] =
    useEditMapStore((state: any) => [
      state.terrainInfo,
      state.setTerrainInfo,
      state.pixelBlocks,
      state.setPixelBlocks,
      state.initData,
    ]);
  const handleAlgorithmBtn = (minDistance: number) => {
    const initialTerrain = algorithm.TerrainRenderer({
      detail: terrainInfo.detail,
      roughness: terrainInfo.roughness,
      pixelSize: 20,
      terrainType: terrainInfo.type,
      maxPixels: terrainInfo.maxPixels,
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
      <div className={styles["left-tool-box"]}>
        <div className="flex items-center justify-between mb-4">
          <h4>生成地形</h4>
          <TbRefresh size={18} />
        </div>

        <RadioGroup
          label="type："
          value={terrainInfo.type}
          orientation="horizontal"
          size="sm"
          classNames={{
            label: cn(
              "text-[#313b49] text-[14px] font-[500] leading-[1.5] tracking-[0.5px] "
            ),
          }}
          onValueChange={(value: string) => setTerrainInfo("type", value)}
        >
          <div className="bg-[#fff] rounded-[50px] p-1 w-full flex items-center justify-between">
            <CustomRadio value={TerrainType.ALL}>All</CustomRadio>
            <CustomRadio value={TerrainType.LAND}>Land</CustomRadio>
            <CustomRadio value={TerrainType.OCEAN}>Ocean</CustomRadio>
          </div>
        </RadioGroup>

        <Slider
          label="detail"
          size="sm"
          step={1}
          maxValue={10}
          minValue={1}
          defaultValue={terrainInfo.detail}
          radius="none"
          className="py-2"
          onChangeEnd={(value) => {
            setTerrainInfo("detail", value);
          }}
        />

        <Slider
          label="roughness"
          size="sm"
          step={1}
          maxValue={10}
          minValue={1}
          defaultValue={terrainInfo.roughness}
          radius="none"
          className="py-2"
          onChangeEnd={(value) => {
            setTerrainInfo("roughness", value);
          }}
        />
        <Slider
          label="maxPixels"
          size="sm"
          step={1}
          maxValue={10000}
          minValue={1000}
          defaultValue={terrainInfo.maxPixels}
          radius="none"
          className="py-2"
          onChangeEnd={(value) => {
            setTerrainInfo("maxPixels", value);
          }}
        />

        <div
          className={
            styles["bottom-tool-box"] +
            " px-[25px] cursor-pointer hover:bg-gray-200 "
          }
          onClick={() => handleAlgorithmBtn(40)}
        >
          生成地形
        </div>
      </div>
    </div>
  );
}
