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
  TbBoxPadding,
  TbCode,
  TbGrid4X4,
  TbInfoHexagon,
  TbMinus,
  TbPlus,
  TbTable,
} from "react-icons/tb";
import useScale from "@/components/hook/canvas/useScale";
import { useBaseStore, useEditMapStore } from "../SocketManager";
import { CSSTransition } from "react-transition-group";
import EditToolView from "./View_EditTool";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import { NumInput } from "@/components/utils/NumInput";

export default function NewMapIndex({ initData }: { initData?: PixelBlock[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [toolInfo, setToolInfo] = useEditMapStore((state: any) => [
    state.toolInfo,
    state.setToolInfo,
  ]);
  const [model] = useBaseStore((state: any) => [state.model]);
  const [isAct, setIsAct] = useState<boolean>(true);
  const [isRightAct, setIsRightAct] = useState<boolean>(false);
  const { scale, setScale } = useScale(1, 0.2, 5, containerRef.current);
  const [selectedModule, setSelectedModule] = useState<string>("");

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

  const handleModuleClick = (module: string) => {
    if (isRightAct && selectedModule === module) {
      setIsRightAct(false);
    } else {
      setIsRightAct(true);
      setSelectedModule(module);
    }
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
        <RightToolView
          setIsRightAct={setIsRightAct}
          selectedModule={selectedModule}
        />
      </CSSTransition>

      <div
        className={`absolute bottom-0 h-[calc(100%-46px)] ${
          styles["transition-all"]
        } ${
          isRightAct
            ? "right-[340px] w-[calc(100%-64px-340px)] bg-gray-200"
            : "right-0 w-[calc(100%-64px)] bg-white"
        }`}
      >
        {model === "EDIT" && <EditToolView />}

        <div ref={containerRef} className="w-full h-full">
          <div
            className={`${styles["right-tool-view"]} ${
              model === "EDIT" ? "mt-[46px]" : ""
            }`}
          >
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
  );
}
