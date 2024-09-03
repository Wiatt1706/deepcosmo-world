"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "@/styles/canvas/map-canvas.module.css";
import ShowMapCanvas from "@/components/map/ShowMapCanvas";
import { PixelBlock } from "@/types/MapTypes";
import RightToolView from "./View_RightTool";
import RightActView from "./View_Act";
import TopToolView from "./View_TopTool";
import {
  TbBoxPadding,
  TbCode,
  TbGrid4X4,
  TbInfoHexagon,
  TbMinus,
  TbPlus,
  TbTable,
} from "react-icons/tb";
import useScale from "@/components/hook/canvas/useScale";
import {
  temporalEditMapStore,
  useBaseStore,
  useEditMapStore,
} from "../SocketManager";
import { CSSTransition } from "react-transition-group";
import EditToolView from "./View_EditTool";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import { NumInput } from "@/components/utils/NumInput";
import { GlobalHotKeys } from "react-hotkeys";
import { Session } from "@supabase/auth-helpers-nextjs";
import useUpdate from "@/components/hook/canvas/useUpdate";

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

export default function NewMapIndex({
  initData,
  initLandInfo,
  session,
}: {
  initData?: PixelBlock[];
  initLandInfo?: Land;
  session: Session | null;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [
    model,
    setInitialLandInfo,
    toolInfo,
    setToolInfo,
    setLandInfo,
    setIsSaveing,
  ] = useBaseStore((state: any) => [
    state.model,
    state.setInitialLandInfo,
    state.toolInfo,
    state.setToolInfo,
    state.setLandInfo,
    state.setIsSaveing,
  ]);

  const [pixelBlocks, setPixelBlocks] = useEditMapStore((state: any) => [
    state.pixelBlocks as PixelBlock[],
    state.setPixelBlocks,
  ]);
  const [isAct, setIsAct] = useState<boolean>(true);
  const [isRightAct, setIsRightAct] = useState<boolean>(false);
  const { scale, setScale } = useScale(1, 0.2, 5, containerRef.current);
  const [selectedModule, setSelectedModule] = useState<string>("");

  useUpdate(initLandInfo?.id, initData);

  useEffect(() => {
    setIsAct(false);
  }, [model]);

  useEffect(() => {
    if (!session) {
      // checkLogin(); // 打开用户登录
      return;
    }
    console.log("session", session);
  }, []);

  const usedBlocksSum = useMemo(() => {
    return pixelBlocks
      ? pixelBlocks.reduce(
          (sum: number, block: PixelBlock) => sum + block.blockCount,
          0
        )
      : 0;
  }, [pixelBlocks]);

  useEffect(() => {
    setLandInfo("used_pixel_blocks", usedBlocksSum);
  }, [usedBlocksSum]);

  useEffect(() => {
    if (initLandInfo) {
      setInitialLandInfo(initLandInfo);
    }
  }, [initLandInfo, setInitialLandInfo]);

  const handleIncreaseScale = () => {
    setScale((prevScale) => Math.min(prevScale + 0.1, 5));
  };

  const handleDecreaseScale = () => {
    setScale((prevScale) => Math.max(prevScale - 0.1, 0.3));
  };

  const handleSelectedPixelBlockChange = (block: PixelBlock | null) => {
    setIsAct(true);
  };

  const handleModuleClick = (module: string) => {
    if (isRightAct && selectedModule === module) {
      setIsRightAct(false);
    } else {
      setIsRightAct(true);
      setSelectedModule(module);
    }
  };

  const { undo, redo } = temporalEditMapStore((state: any) => ({
    undo: state.undo,
    redo: state.redo,
  }));

  const handlers: { [key: string]: (keyEvent?: KeyboardEvent) => void } = {
    UNDO: () => undo(),
    REDO: () => redo(),
    SAVE: (event) => {
      event?.preventDefault();
      setIsSaveing(true);
    },
    ONE: () => setToolInfo("brushSize", 1),
    TWO: () => setToolInfo("brushSize", 2),
    THREE: () => setToolInfo("brushSize", 3),
    FOUR: () => setToolInfo("brushSize", 4),
    FIVE: () => setToolInfo("brushSize", 5),
    SIX: () => setToolInfo("brushSize", 6),
    SEVEN: () => setToolInfo("brushSize", 7),
    EIGHT: () => setToolInfo("brushSize", 8),
    NINE: () => setToolInfo("brushSize", 9),
  };

  return (
    <GlobalHotKeys id="main" keyMap={keyMap} handlers={handlers}>
      <div className="w-full h-full relative overflow-hidden">
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
          mountOnEnter
          unmountOnExit
        >
          <RightToolView
            setIsRightAct={setIsRightAct}
            selectedModule={selectedModule}
          />
        </CSSTransition>

        <div
          className={`h-[calc(100%-46px)] ${
            model === "EDIT"
              ? "h-[calc(100%-46px-46px)]"
              : "h-[calc(100%-46px)]"
          } ${styles["transition-all"]} ${
            isRightAct
              ? "w-[calc(100%-340px)] bg-gray-200"
              : "w-[calc(100%)] bg-white"
          }`}
        >
          {model === "EDIT" && <EditToolView />}

          <div ref={containerRef} className="w-full h-full relative">
            <div className={`${styles["right-tool-view"]}`}>
              <div>
                <div
                  onClick={() => handleModuleClick("table")}
                  className={`bg-[#fff] mb-2 shadow flex justify-center items-center w-[40px] h-[40px] rounded cursor-pointer hover:bg-[#d9e0e6] hover:text-[#63727e] ${
                    isRightAct && selectedModule === "table" && "text-[#006fef]"
                  }`}
                >
                  <TbTable size={20} />
                </div>
                <div
                  onClick={() => handleModuleClick("info")}
                  className={`bg-[#fff] mb-2 shadow flex justify-center items-center w-[40px] h-[40px] rounded cursor-pointer hover:bg-[#d9e0e6] hover:text-[#63727e] ${
                    isRightAct && selectedModule === "info" && "text-[#006fef]"
                  }`}
                >
                  <TbInfoHexagon size={20} />
                </div>

                <div
                  onClick={() => handleModuleClick("code")}
                  className={`bg-[#fff] mb-2 shadow flex justify-center items-center w-[40px] h-[40px] rounded cursor-pointer hover:bg-[#d9e0e6] hover:text-[#63727e] ${
                    isRightAct && selectedModule === "code" && "text-[#006fef]"
                  }`}
                >
                  <TbCode size={20} />
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
                <Popover placement="left" showArrow={true}>
                  <PopoverTrigger>
                    <div
                      className={`bg-[#fff] mb-2 shadow flex justify-center items-center w-[40px] h-[40px] rounded cursor-pointer hover:bg-[#d9e0e6] hover:text-[#63727e]`}
                    >
                      <TbBoxPadding size={20} />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="px-1 py-2 ">
                      Pixel Padding
                      <NumInput
                        value={toolInfo.pixelPadding}
                        onUpdate={(value) => {
                          setToolInfo("pixelPadding", value);
                        }}
                        maxValue={20}
                        minValue={-1}
                      />
                    </div>
                  </PopoverContent>
                </Popover>

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
              rectSize={100 * 20}
            />
          </div>
        </div>
      </div>
    </GlobalHotKeys>
  );
}
