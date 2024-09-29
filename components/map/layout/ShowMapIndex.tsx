"use client";
import styles from "@/styles/canvas/map-canvas.module.css";
import { useEffect, useMemo, useRef, useState } from "react";
import useScale from "@/components/hook/canvas/useScale";
import ShowMapCanvas from "../ShowMapCanvas";
import { Session } from "@supabase/auth-helpers-nextjs";
import { PixelBlock, Position, PositionAndSize } from "@/types/MapTypes";
import LeftMenuView from "./View_LeftMenu";
import { CSSTransition } from "react-transition-group";
import LeftToolView from "./View_LeftTool";
import { TbGrid4X4, TbMinus, TbPlus, TbTable } from "react-icons/tb";
import { useRouter } from "next/navigation";
import { create } from "zustand";

export const useShowBaseStore = create((set) => ({
  selectedPixelBlock: null as PixelBlock | null,
  lastListPixelBlock: new Set() as Set<PixelBlock>,
  viewport: {} as PositionAndSize,
  viewMapCenter: {} as Position,
  selectedModule: "",
  setSelectedPixelBlock: (selectedPixelBlock: PixelBlock | null) =>
    set({ selectedPixelBlock }),
  setViewport: (viewport: PositionAndSize) => set({ viewport }),
  setViewMapCenter: (viewMapCenter: Position) => set({ viewMapCenter }),
  setSelectedModule: (selectedModule: string) => set({ selectedModule }),
  setLastListPixelBlock: (lastListPixelBlock: PixelBlock[]) =>
    set({ lastListPixelBlock }),
}));

export default function ShowMapIndex({
  loadData,
  loadScale,
  loadX,
  loadY,
  session,
}: {
  loadData?: PixelBlock[];
  loadScale?: number;
  loadX?: number;
  loadY?: number;
  session?: Session | null;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRightMenu, setIsRightMenu] = useState<boolean>(true);
  const [isLeftAct, setIsLeftAct] = useState<boolean>(false);
  const { scale, setScale } = useScale(
    loadScale || 1,
    0.5,
    5,
    0.5,
    containerRef.current
  );

  const [
    selectedPixelBlock,
    viewport,
    viewMapCenter,
    selectedModule,
    setSelectedModule,
  ] = useShowBaseStore((state: any) => [
    state.selectedPixelBlock,
    state.viewport,
    state.viewMapCenter,
    state.selectedModule,
    state.setSelectedModule,
  ]);

  useEffect(() => {
    console.log("viewMapCenter", viewMapCenter);
  }, [viewport]);

  const handleIncreaseScale = () => {
    setScale((prevScale) => Math.min(prevScale + 0.5, 5));
  };

  const handleDecreaseScale = () => {
    setScale((prevScale) => Math.max(prevScale - 0.5, 0.5));
  };

  const handleModuleClick = (module: string) => {
    if (isLeftAct && selectedModule === module) {
      setIsLeftAct(false);
    } else {
      setIsLeftAct(true);
      setSelectedModule(module);
    }
  };

  useEffect(() => {
    if (!isLeftAct) {
      setSelectedModule("");
    }
  }, [isLeftAct]);

  return (
    <div className="flex relative w-full h-full overflow-hidden">
      <LeftMenuView handleMenuClick={handleModuleClick} />

      <CSSTransition
        in={isLeftAct}
        timeout={300}
        classNames={{
          enter: styles["left-view-enter"],
          enterActive: styles["left-view-enter-active"],
          exit: styles["left-view-exit"],
          exitActive: styles["left-view-exit-active"],
        }}
        mountOnEnter
        unmountOnExit
      >
        <LeftToolView setIsAct={setIsLeftAct} selectedModule={selectedModule} />
      </CSSTransition>

      <div
        ref={containerRef}
        className={`transition-all h-full  absolute right-0 ${
          isRightMenu
            ? isLeftAct
              ? "w-[calc(100%-404px)]"
              : "w-[calc(100%-64px)]"
            : "w-full"
        }`}
      >
        <div className={`${styles["right-tool-view"]}`}>
          <div>
            <div
              onClick={() => handleModuleClick("table")}
              className={`bg-[#fff] mb-2 shadow flex justify-center items-center w-[40px] h-[40px] rounded cursor-pointer hover:bg-[#d9e0e6] hover:text-[#63727e] ${
                isLeftAct && selectedModule === "table" && "text-[#006fef]"
              }`}
            >
              <TbTable size={20} />
            </div>
          </div>
          <div>
            <div
              className={`bg-[#fff] mb-2 shadow flex justify-center items-center w-[40px] h-[40px] rounded cursor-pointer hover:bg-[#d9e0e6] hover:text-[#63727e] `}
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
          loadX={loadX}
          loadY={loadY}
          loadData={loadData}
        />
      </div>
    </div>
  );
}
