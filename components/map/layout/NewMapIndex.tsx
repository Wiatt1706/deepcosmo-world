// pages/NewMapPage.tsx
"use client";
import { useState } from "react";
import styles from "@/styles/canvas/map-canvas.module.css";
import ShowMapCanvas from "@/components/map/ShowMapCanvas";
import { PixelBlock } from "@/types/MapTypes";
import { Slider } from "@nextui-org/react";
import algorithm from "@/components/map/helpers/algorithm";
import LeftToolView from "./View_LeftTool";
import RightToolView from "./View_RightTool";
import RightActView from "./View_Act";
import TopToolView from "./View_TopTool";

export default function NewMapIndex({ initData }: { initData?: PixelBlock[] }) {
  const [actPixelBlock, setActPixelBlock] = useState<PixelBlock | null>(null);
  const [isAct, setIsAct] = useState<boolean>(false);
  const [isRightAct, setIsRightAct] = useState<boolean>(false);

  const handleActClick = (pixelBlock: PixelBlock | null) => {
    setActPixelBlock(pixelBlock);
    setIsAct(true);
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <LeftToolView />
      <TopToolView />
      <RightActView
        actPixelBlock={actPixelBlock}
        isAct={isAct}
        setIsAct={setIsAct}
      />
      <RightToolView isRightAct={isRightAct} setIsRightAct={setIsRightAct} />

      <div className="absolute bottom-0 right-[340px] w-[calc(100%-250px-340px)] h-[calc(100%-46px)]">
        <ShowMapCanvas initData={initData} handleActClick={handleActClick} />
      </div>
    </div>
  );
}