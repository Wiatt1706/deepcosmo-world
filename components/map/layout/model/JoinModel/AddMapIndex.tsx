"use client";
import { useEffect, useRef, useState } from "react";
import { PixelBlock } from "@/types/MapTypes";

import useScale from "@/components/hook/canvas/useScale";
import { useTemporalEditMapStore } from "../../../SocketManager";
import { GlobalHotKeys } from "react-hotkeys";
import { Session } from "@supabase/auth-helpers-nextjs";
import AddMapCanvas, {
  AddMapValidAimAtom,
  AddMapValidBlocksAtom,
} from "./AddMapCanvas";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { loadDataAtom } from "../../../store/ShowBaseAtomStore";
import AddMapEditTool from "./AddMapEditTool";
import { CtrlScale } from "../../View_CanvasTool";
import { Button } from "@nextui-org/button";
import { LiLandsBoxSvg } from "@/components/utils/icons";
import { ModalBody, ModalFooter } from "@nextui-org/react";

const keyMap = {
  UNDO: "ctrl+z",
  REDO: "ctrl+shift+z",
  SAVE: "ctrl+s",
  ONE: "1",
  TWO: "2",
  THREE: "3",
  FOUR: "4",
  FIVE: "5",
  SIX: "6",
  SEVEN: "7",
  EIGHT: "8",
  NINE: "9",
};

export default function AddMapIndex({
  landInfo,
  onNext,
  session,
}: {
  landInfo: Land;
  onNext: () => void;
  session?: Session | null;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [addMapValidBlocks, setAddMapValidBlocks] = useAtom(
    AddMapValidBlocksAtom
  );
  const setValidAim = useSetAtom(AddMapValidAimAtom);

  const { scale, setScale } = useScale(0.5, 0.5, 5, 0.5, containerRef.current);

  const [validData, setValidData] = useState<PixelBlock[] | null>(null);
  const [userPixelBlockData, setUserPixelBlockData] = useState<
    PixelBlock[] | null
  >(null);
  const loadData = useAtomValue(loadDataAtom);

  const clearAddMapValidData = () => {
    setValidAim(null);
    setAddMapValidBlocks([]);
  };
  useEffect(() => {
    setValidData(
      loadData.filter(
        (item) => item.status == 3 && item.owner != session?.user.id
      )
    );
    setUserPixelBlockData(
      loadData.filter((item) => item.owner == session?.user.id)
    );
  }, [loadData]);

  const [toolInfo, setToolInfo] = useState<any>({
    pixelSize: 20,
    brushSize: 1,
    pixelPadding: 1,
    editColor: "#0080ff",
    isGrid: true,
    type: "0",
    status: "0",
    editable: true,
  });

  const { undo, redo } = useTemporalEditMapStore((state: any) => ({
    undo: state.undo,
    redo: state.redo,
  }));

  const handlers: { [key: string]: (keyEvent?: KeyboardEvent) => void } = {
    UNDO: () => undo(),
    REDO: () => redo(),
    ONE: () =>
      setToolInfo({
        ...toolInfo,
        brushSize: 1,
      }),
    TWO: () =>
      setToolInfo({
        ...toolInfo,
        brushSize: 2,
      }),
    THREE: () =>
      setToolInfo({
        ...toolInfo,
        brushSize: 3,
      }),
    FOUR: () =>
      setToolInfo({
        ...toolInfo,
        brushSize: 4,
      }),
    FIVE: () =>
      setToolInfo({
        ...toolInfo,
        brushSize: 5,
      }),
    SIX: () =>
      setToolInfo({
        ...toolInfo,
        brushSize: 6,
      }),
    SEVEN: () =>
      setToolInfo({
        ...toolInfo,
        brushSize: 7,
      }),
    EIGHT: () =>
      setToolInfo({
        ...toolInfo,
        brushSize: 8,
      }),
    NINE: () =>
      setToolInfo({
        ...toolInfo,
        brushSize: 9,
      }),
  };
  return (
    <>
      <ModalBody>
        <div className="flex flex-col relative ">
          <div className="flex flex-col relative border">
            <GlobalHotKeys id="main" keyMap={keyMap} handlers={handlers}>
              <div className="w-full h-[350px] relative overflow-hidden">
                <AddMapEditTool toolInfo={toolInfo} setToolInfo={setToolInfo} />
                <div ref={containerRef} className="w-full h-full relative">
                  <AddMapCanvas
                    scale={scale}
                    loadData={validData}
                    userPixelBlockData={userPixelBlockData}
                    toolInfo={toolInfo}
                    rectSize={
                      Number.parseInt(String(landInfo?.land_level) || "1") *
                      10 *
                      2 *
                      20
                    }
                  />
                  <div className="absolute bottom-14 right-2">
                    <CtrlScale scale={scale} setScale={setScale} />
                  </div>
                </div>
              </div>
            </GlobalHotKeys>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <div className="d_c_b w-full">
          <div className="flex gap-2 items-center text-gray-500 text-sm">
            {addMapValidBlocks.length > 0 ? (
              <>
                <span>当前共耗费{addMapValidBlocks.length}块 </span>
                <LiLandsBoxSvg width={16} height={16} />
              </>
            ) : (
              <span>移动光标选择目标地块，数字键切换</span>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={clearAddMapValidData}
              isDisabled={!(addMapValidBlocks.length > 0)}
            >
              清除
            </Button>
            <Button
              color="primary"
              size="sm"
              onClick={onNext}
              isDisabled={!(addMapValidBlocks.length > 0)}
            >
              Next
            </Button>
          </div>
        </div>
      </ModalFooter>
    </>
  );
}
