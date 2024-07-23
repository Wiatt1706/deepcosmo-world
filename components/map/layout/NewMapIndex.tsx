"use client";
import { useEffect, useRef, useState } from "react";
import styles from "@/styles/canvas/map-canvas.module.css";
import ShowMapCanvas from "@/components/map/ShowMapCanvas";
import { PixelBlock } from "@/types/MapTypes";
import LeftToolView from "./View_LeftTool";
import RightToolView from "./View_RightTool";
import RightActView from "./View_Act";
import TopToolView from "./View_TopTool";
import {
  TbGrid4X4,
  TbInfoHexagon,
  TbMinus,
  TbPlus,
  TbTable,
} from "react-icons/tb";
import useScale from "@/components/hook/canvas/useScale";
import { useBaseStore, useEditMapStore } from "../SocketManager";
import { CSSTransition } from "react-transition-group";

export default function NewMapIndex({ initData }: { initData?: PixelBlock[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [toolInfo, setToolInfo] = useEditMapStore((state: any) => [
    state.toolInfo,
    state.setToolInfo,
  ]);
  const [model] = useBaseStore((state: any) => [state.model]);
  const [isAct, setIsAct] = useState<boolean>(true);
  const [isRightAct, setIsRightAct] = useState<boolean>(true);
  const { scale, setScale } = useScale(1, 0.3, 5, containerRef.current);

  useEffect(() => {
    setIsAct(false);
  }, [model]);

  const handleIncreaseScale = () => {
    setScale((prevScale) => Math.min(prevScale + 0.1, 5));
  };

  const handleDecreaseScale = () => {
    setScale((prevScale) => Math.max(prevScale - 0.1, 0.3));
  };

  const handleSelectedPixelBlockChange = (block: PixelBlock | null) => {
    setIsAct(true);
  };

  return (
    <div className="w-screen h-screen">
      <LeftToolView />
      <TopToolView />

      {isAct && <RightActView setIsAct={setIsAct} />}
      <CSSTransition
        in={isRightAct}
        timeout={300}
        classNames={{
          enter: styles["right-view-enter"],
          enterActive: styles["right-view-enter-active"],
          exit: styles["right-view-exit"],
          exitActive: styles["right-view-exit-active"],
        }}
        unmountOnExit
      >
        <RightToolView setIsRightAct={setIsRightAct} />
      </CSSTransition>

      <div
        ref={containerRef}
        className={`absolute bottom-0 h-[calc(100%-46px)] ${
          styles["transition-all"]
        } ${
          isRightAct
            ? "right-[340px] w-[calc(100%-64px-340px)] bg-gray-200"
            : "right-0 w-[calc(100%-64px)] bg-white"
        }`}
      >
        <div className={styles["right-tool-view"]}>
          <div>
            <div
              onClick={() => setIsRightAct(!isRightAct)}
              className={`bg-[#fff] mb-2 shadow flex justify-center items-center w-[40px] h-[40px] rounded cursor-pointer hover:bg-[#d9e0e6] hover:text-[#63727e] ${
                isRightAct && "text-[#006fef]"
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
                toolInfo.isGrid && "text-[#006fef]"
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
          onSelectedPixelBlockChange={handleSelectedPixelBlockChange}
        />
      </div>
    </div>
  );
}
