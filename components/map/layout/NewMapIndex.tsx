// pages/NewMapPage.tsx
"use client";
import { useState } from "react";
import styles from "@/styles/canvas/map-canvas.module.css";
import ShowMapCanvas from "@/components/map/ShowMapCanvas";
import { PixelBlock } from "@/types/MapTypes";
import { Slider } from "@nextui-org/react";
import algorithm from "@/components/map/helpers/algorithm";
import LeftToolView from "./View_LeftTool";
import RightActView from "./View_RightAct";

export default function NewMapIndex({ initData }: { initData?: PixelBlock[] }) {
  const [actPixelBlock, setActPixelBlock] = useState<PixelBlock | null>(null);
  const [isAct, setIsAct] = useState<boolean>(false);

  const handleActClick = (pixelBlock: PixelBlock | null) => {
    setActPixelBlock(pixelBlock);
    setIsAct(true);
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <LeftToolView />
      <RightActView
        actPixelBlock={actPixelBlock}
        isAct={isAct}
        setIsAct={setIsAct}
      />
      <ShowMapCanvas initData={initData} handleActClick={handleActClick} />
    </div>
  );
}
