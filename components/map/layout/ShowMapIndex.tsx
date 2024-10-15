"use client";
import { useEffect, useRef, useState } from "react";
import useScale from "@/components/hook/canvas/useScale";
import { Session } from "@supabase/auth-helpers-nextjs";
import { PixelBlock, Position, PositionAndSize } from "@/types/MapTypes";
import { create } from "zustand";
import LeftInfoView from "./View_LeftInfo";
import ShowMapCanvas from "../ShowMapCanvas";
import CanavsToolView from "./View_CanvasTool";

export const useShowBaseStore = create((set) => ({
  selectedPixelBlock: null as PixelBlock | null,
  lastListPixelBlock: new Set() as Set<PixelBlock>,
  viewport: {} as PositionAndSize,
  viewMapCenter: {} as Position,
  selectedModule: "",
  userCustomList: null,
  isLeftAct: false,
  selectedListObj: null,
  loadData: new Set() as Set<PixelBlock>,
  setSelectedPixelBlock: (selectedPixelBlock: PixelBlock | null) =>
    set({ selectedPixelBlock }),
  setViewport: (viewport: PositionAndSize) => set({ viewport }),
  setViewMapCenter: (viewMapCenter: Position) => set({ viewMapCenter }),
  setSelectedModule: (selectedModule: string) => set({ selectedModule }),
  setLastListPixelBlock: (lastListPixelBlock: PixelBlock[]) =>
    set({ lastListPixelBlock }),
  setUserCustomList: (userCustomList: any) => set({ userCustomList }),
  setIsLeftAct: (isLeftAct: boolean) => set({ isLeftAct }),
  setSelectedListObj: (selectedListObj: any) => set({ selectedListObj }),
  setLoadData: (loadData: PixelBlock[]) => set({ loadData }),
}));

export default function ShowMapIndex({
  loadData,
  loadScale,
  loadX,
  loadY,
}: {
  loadData?: PixelBlock[];
  loadScale?: number;
  loadX?: number;
  loadY?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRightMenu, setIsRightMenu] = useState<boolean>(true);
  const { scale, setScale } = useScale(
    loadScale || 1,
    0.5,
    5,
    0.5,
    containerRef.current
  );
  const [setLoadData, isLeftAct, setSelectedModule] = useShowBaseStore(
    (state: any) => [
      state.setLoadData,
      state.isLeftAct,
      state.setSelectedModule,
    ]
  );

  useEffect(() => {
    setLoadData(loadData || new Set());
  }, [loadData]);

  useEffect(() => {
    if (!isLeftAct) {
      setSelectedModule("");
    }
  }, [isLeftAct]);

  return (
    <div
      ref={containerRef}
      className={`transition-all h-full  absolute right-0 ${
        isRightMenu
          ? isLeftAct
            ? "w-[calc(100%-424px)]"
            : "w-[calc(100%-64px)]"
          : "w-full"
      }`}
    >
      <LeftInfoView />
      <CanavsToolView scale={scale} setScale={setScale} />

      <ShowMapCanvas
        scale={scale}
        loadX={loadX}
        loadY={loadY}
        loadData={loadData}
      />
    </div>
  );
}
