"use client";
import { LegacyRef, useEffect, useRef, useState } from "react";
import useScale from "@/components/hook/canvas/useScale";
import { PixelBlock } from "@/types/MapTypes";
import LeftInfoView from "./left-view-model/View_LeftInfo";
import ShowMapCanvas from "../ShowMapCanvas";
import CanavsToolView from "./View_CanvasTool";
import { useAtomValue, useSetAtom } from "jotai";
import {
  isLeftActAtom,
  loadDataAtom,
  selectedModuleAtom,
} from "../store/ShowBaseAtomStore";

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

  const setLoadData = useSetAtom(loadDataAtom);
  const setSelectedModule = useSetAtom(selectedModuleAtom);
  const isLeftAct = useAtomValue(isLeftActAtom);

  useEffect(() => {
    setLoadData(loadData || []);
  }, [loadData]);

  useEffect(() => {
    if (!isLeftAct) {
      setSelectedModule("");
    }
  }, [isLeftAct]);

  return (
    <div
      ref={containerRef as LegacyRef<HTMLDivElement>}
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
      <ShowMapCanvas scale={scale} loadX={loadX} loadY={loadY} />
    </div>
  );
}
