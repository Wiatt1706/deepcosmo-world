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
import { post as postApi, put as putApi, del as delApi } from "@/utils/api";
import { Session } from "@supabase/auth-helpers-nextjs";
import { useUserStore } from "@/components/SocketManager";

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
  const checkLogin = useUserStore((state) => state.checkLogin);

  const containerRef = useRef<HTMLDivElement>(null);
  const [model, setInitialLandInfo, toolInfo, setToolInfo, setLandInfo] =
    useBaseStore((state: any) => [
      state.model,
      state.setInitialLandInfo,
      state.toolInfo,
      state.setToolInfo,
      state.setLandInfo,
    ]);

  const [pixelBlocks, setPixelBlocks] = useEditMapStore((state: any) => [
    state.pixelBlocks as PixelBlock[],
    state.setPixelBlocks,
  ]);
  const [isAct, setIsAct] = useState<boolean>(true);
  const [isRightAct, setIsRightAct] = useState<boolean>(false);
  const { scale, setScale } = useScale(1, 0.2, 5, containerRef.current);
  const [selectedModule, setSelectedModule] = useState<string>("");

  // 防抖定时器的引用
  const pixelBlocksChangeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const blocksDetectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [originalPixelBlocksMap, setOriginalPixelBlocksMap] = useState<
    Map<string, PixelBlock>
  >(new Map(initData?.map((block) => [`${block.x}_${block.y}`, block])));

  const addedBlocksRef = useRef<Map<string, PixelBlock>>(new Map());
  const modifiedBlocksRef = useRef<Map<string, PixelBlock>>(new Map());
  const deletedBlocksRef = useRef<Set<string>>(new Set());

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
      detectBlocksSave();
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

  // 监听 pixelBlocks 的变动，三秒防抖
  useEffect(() => {
    if (pixelBlocksChangeTimeoutRef.current) {
      clearTimeout(pixelBlocksChangeTimeoutRef.current);
    }

    pixelBlocksChangeTimeoutRef.current = setTimeout(() => {
      const currentPixelBlocksMap = new Map(
        pixelBlocks.map((block: PixelBlock) => [`${block.x}_${block.y}`, block])
      );

      // Detect added and modified blocks
      currentPixelBlocksMap.forEach((block, id) => {
        const originalBlock = originalPixelBlocksMap.get(id);

        if (!originalBlock) {
          // Block is new
          if (deletedBlocksRef.current.has(id)) {
            // If it was previously deleted, just remove from deleted set
            deletedBlocksRef.current.delete(id);
          } else {
            // Otherwise, add to addedBlocksRef
            addedBlocksRef.current.set(id, block);
          }
        } else if (JSON.stringify(block) !== JSON.stringify(originalBlock)) {
          // Block is modified
          if (addedBlocksRef.current.has(id)) {
            // If it's already in addedBlocksRef, update it there
            addedBlocksRef.current.set(id, block);
          } else {
            // Otherwise, add to modifiedBlocksRef
            modifiedBlocksRef.current.set(id, block);
          }
        }
      });

      // Detect deleted blocks
      originalPixelBlocksMap.forEach((_, id) => {
        if (!currentPixelBlocksMap.has(id)) {
          if (addedBlocksRef.current.has(id)) {
            // If it was added and now deleted, remove from added set
            addedBlocksRef.current.delete(id);
          } else {
            // Otherwise, add to deletedBlocksRef
            deletedBlocksRef.current.add(id);
          }
        }
      });

      // Update originalPixelBlocksMap
      setOriginalPixelBlocksMap(
        new Map(pixelBlocks.map((block) => [`${block.x}_${block.y}`, block]))
      );
    }, 2000);

    return () => {
      if (pixelBlocksChangeTimeoutRef.current) {
        clearTimeout(pixelBlocksChangeTimeoutRef.current);
      }
    };
  }, [pixelBlocks]);

  // 检测新增、修改、删除的 pixelBlocks 数据，十秒防抖
  const detectBlocksSave = () => {
    // 保存操作后，更新初始值

    // 此处可以进行相应的 API 调用或保存操作
    if (addedBlocksRef.current.size > 0) {
      processAddedBlocks(Array.from(addedBlocksRef.current.values()));
      console.log("Added Blocks:", addedBlocksRef.current);
    }
    if (modifiedBlocksRef.current.size > 0) {
      processModifiedBlocks(Array.from(modifiedBlocksRef.current.values()));
      console.log("Modified Blocks:", modifiedBlocksRef.current);
    }
    if (deletedBlocksRef.current.size > 0) {
      processDeletedBlocks(deletedBlocksRef.current);
      console.log("Deleted Blocks:", deletedBlocksRef.current);
    }

    // 清空临时变量
    addedBlocksRef.current.clear();
    modifiedBlocksRef.current.clear();
    deletedBlocksRef.current.clear();
  };

  const processAddedBlocks = async (
    addedBlocks: PixelBlock[]
  ): Promise<void> => {
    // 在这里添加调用API的逻辑
    await postApi(`/landInfo`, {
      pixelBlocks: addedBlocks,
      parentLandId: initLandInfo?.id,
    }).then((response) => {
      if (response.data) {
        console.log("Added Blocks:", addedBlocks);
      } else {
        console.error("Failed to processAddedBlocks:", response.data.message);
      }
    });
  };

  const processModifiedBlocks = async (
    modifiedBlocks: PixelBlock[]
  ): Promise<void> => {
    await putApi(`/landInfo`, {
      pixelBlocks: modifiedBlocks,
      parentLandId: initLandInfo?.id,
    }).then((response) => {
      if (response.data) {
        console.log("Modified Blocks:", modifiedBlocks);
      } else {
        console.error("Failed to processModifiedBlocks:", response.data);
      }
    });
  };

  const processDeletedBlocks = async (
    deletedBlocks: Set<string>
  ): Promise<void> => {
    const pixelBlocks = Array.from(deletedBlocks).map((block) => {
      const [x, y] = block.split("_").map(Number);
      return { x, y };
    });

    await delApi(`/landInfo`, {
      pixelBlocks: pixelBlocks,
      parentLandId: initLandInfo?.id,
    }).then((response) => {
      if (response.data) {
        console.log("Deleted Blocks:", deletedBlocks);
      } else {
        console.error("Failed to processDeletedBlocks:", response.data);
      }
    });
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
