"use client";
import styles from "@/styles/canvas/map-canvas.module.css";
import { TbGrid4X4, TbMinus, TbPlus, TbTable } from "react-icons/tb";
import { useShowBaseStore } from "./ShowMapIndex";

export default function CanavsToolView({
  scale,
  setScale,
}: {
  scale: number;
  setScale: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [isLeftAct, selectedModule] = useShowBaseStore((state: any) => [
    state.isLeftAct,
    state.selectedModule,
  ]);

  const handleIncreaseScale = () => {
    setScale((prevScale) => Math.min(prevScale + 0.5, 5));
  };

  const handleDecreaseScale = () => {
    setScale((prevScale) => Math.max(prevScale - 0.5, 0.5));
  };

  return (
    <div className={`${styles["right-tool-view"]}`}>
      <div>
        <div
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
            <span className="text-[#000] text-[10px]">{`${(scale * 100).toFixed(
              0
            )}%`}</span>
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
  );
}
