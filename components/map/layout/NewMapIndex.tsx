// pages/NewMapPage.tsx
"use client";
import { useRef, useState } from "react";
import styles from "@/styles/canvas/map-canvas.module.css";
import ShowMapCanvas from "@/components/map/ShowMapCanvas";
import { PixelBlock } from "@/types/MapTypes";
import { Slider } from "@nextui-org/react";
import algorithm from "@/components/map/helpers/algorithm";
import LeftToolView from "./View_LeftTool";
import RightToolView from "./View_RightTool";
import RightActView from "./View_Act";
import TopToolView from "./View_TopTool";
import {
  Tb12Hours,
  TbChartBar,
  TbGrid3X3,
  TbGrid4X4,
  TbInfoHexagon,
  TbMinus,
  TbPlus,
  TbTable,
  TbTableFilled,
} from "react-icons/tb";
import useScale from "@/components/hook/canvas/useScale";
import { useEditMapStore } from "../SocketManager";

export default function NewMapIndex({ initData }: { initData?: PixelBlock[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [toolInfo, setToolInfo] = useEditMapStore((state: any) => [
    state.toolInfo,
    state.setToolInfo,
  ]);

  const [actPixelBlock, setActPixelBlock] = useState<PixelBlock | null>(null);
  const [isAct, setIsAct] = useState<boolean>(false);
  const [isRightAct, setIsRightAct] = useState<boolean>(true);
  const { scale, setScale } = useScale(1, 0.3, 5, containerRef.current);

  const handleActClick = (pixelBlock: PixelBlock | null) => {
    setActPixelBlock(pixelBlock);
    setIsAct(true);
  };

  const handleIncreaseScale = () => {
    setScale((prevScale) => Math.min(prevScale + 0.1, 5));
  };

  const handleDecreaseScale = () => {
    setScale((prevScale) => Math.max(prevScale - 0.1, 0.3));
  };

  return (
    <div className="w-screen h-screen">
      <LeftToolView />
      <TopToolView />
      <RightActView
        actPixelBlock={actPixelBlock}
        isAct={isAct}
        setIsAct={setIsAct}
      />

      {isRightAct && <RightToolView setIsRightAct={setIsRightAct} />}

      <div
        ref={containerRef}
        className={`absolute bottom-0 h-[calc(100%-46px)] ${
          isRightAct
            ? "right-[340px] w-[calc(100%-250px-340px)] bg-gray-200"
            : "right-0 w-[calc(100%-250px)] bg-white"
        }`}
      >
        <div className={styles["right-tool-view"]}>
          <div>
            <div
              onClick={() => setIsRightAct(!isRightAct)}
              className={`bg-[#fff] mb-2 shadow flex justify-center items-center w-[40px] h-[40px] rounded cursor-pointer hover:bg-[#d9e0e6] hover:text-[#63727e] ${
                isRightAct && "text-[#019d91]"
              }`}
            >
              <TbTable size={20} />
            </div>
            <div
              onClick={() => setIsRightAct(!isRightAct)}
              className={`bg-[#fff] shadow flex justify-center items-center w-[40px] h-[40px] rounded cursor-pointer hover:bg-[#d9e0e6] hover:text-[#63727e]`}
            >
              <TbInfoHexagon size={20} />
            </div>
          </div>
          <div>
            <div
              onClick={() => setToolInfo("isGrid", !toolInfo.isGrid)}
              className={`bg-[#fff] mb-2 shadow flex justify-center items-center w-[40px] h-[40px] rounded cursor-pointer hover:bg-[#d9e0e6] hover:text-[#63727e] ${
                toolInfo.isGrid && "text-[#019d91]"
              }`}
            >
              <TbGrid4X4 size={20} />
            </div>
            <div
              className={`bg-[#fff] shadow justify-center items-center w-[40px] rounded`}
            >
              <div
                onClick={handleIncreaseScale}
                className={`bg-[#fff] flex justify-center items-center w-[40px] h-[40px] cursor-pointer hover:bg-[#d9e0e6] rounded-tl rounded-tr border-b`}
              >
                <TbPlus size={20} />
              </div>
              <div
                className={`bg-[#fff] flex justify-center items-center w-[40px] h-[40px]`}
              >
                <span className="text-[#000] text-[10px]">{`${(
                  scale * 100
                ).toFixed(0)}%`}</span>
              </div>
              <div
                onClick={handleDecreaseScale}
                className={`bg-[#fff] flex justify-center items-center w-[40px] h-[40px] cursor-pointer hover:bg-[#d9e0e6] rounded-bl rounded-br border-t`}
              >
                <TbMinus size={20} />
              </div>
            </div>
          </div>
        </div>
        <ShowMapCanvas
          scale={scale}
          initData={initData}
          handleActClick={handleActClick}
        />
      </div>
    </div>
  );
}
