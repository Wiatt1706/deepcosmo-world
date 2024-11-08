import React, { useState } from "react";
import styles from "@/styles/canvas/ViewLeftMenu.module.css";
import { useBaseStore, useEditMapStore } from "@/components/map/SocketManager";
import { Select } from "@/components/utils/DLCModule";
import {
  Select as NextSelect,
  SelectItem,
  RadioGroup,
  Switch,
  cn,
} from "@nextui-org/react";
import { CustomRadio } from "@/components/utils/CustomRadio";
import algorithm, { TerrainType } from "@/components/map/helpers/algorithm";
import { NumInput } from "@/components/utils/NumInput";
import { ColorPicker } from "@/components/utils/ColorPicker";
import { LAND_TYPE, OPTION_TEST_LIST4, PixelBlock } from "@/types/MapTypes";
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
        } else {
          newBlock.type = toolInfo.type;
          newBlock.status = toolInfo.status;
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

        <div className="flex items-center justify-between w-full">
          <span className="text-sm ml-4">生成类型：</span>

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
        <div className="flex items-center justify-between w-full">
          <span className="text-sm ml-4">生成状态：</span>

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
