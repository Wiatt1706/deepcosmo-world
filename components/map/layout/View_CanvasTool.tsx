"use client";
import styles from "@/styles/canvas/map-canvas.module.css";
import {
  TbDeviceGamepad2,
  TbEye,
  TbEyeOff,
  TbGrid4X4,
  TbHome,
  TbMinus,
  TbPennant2,
  TbPlus,
} from "react-icons/tb";
import {
  isLeftActAtom,
  isShowSignImageAtom,
  selectedModuleAtom,
  signImageModuleAtom,
} from "../store/ShowBaseAtomStore";
import { useAtom, useAtomValue } from "jotai";
import { Button } from "@nextui-org/button";
import AuthButtonClient from "@/components/layout/auth-button-client";
import { Session } from "@supabase/auth-helpers-nextjs";

export default function CanavsToolView({
  scale,
  setScale,
  session,
}: {
  scale: number;
  setScale: React.Dispatch<React.SetStateAction<number>>;
  session?: Session | null;
}) {
  const [isShowSignImage, setIsShowSignImage] = useAtom(isShowSignImageAtom);
  const [signImageModule, setSignImageModule] = useAtom(signImageModuleAtom);
  const handleIncreaseScale = () => {
    setScale((prevScale) => Math.min(prevScale + 0.5, 5));
  };

  const handleDecreaseScale = () => {
    setScale((prevScale) => Math.max(prevScale - 0.5, 0.5));
  };

  const handleSignImageButtonClick = (v: string) => {
    if (signImageModule === v) {
      setSignImageModule(""); // 清空
    } else {
      setSignImageModule(v); // 设为新值，替换为你需要的值
      setIsShowSignImage(true);
    }
  };

  const handleToggleShowSignImage = () => {
    setIsShowSignImage((prev) => {
      const newValue = !prev;
      setSignImageModule(""); // 重置 signImageModule
      return newValue;
    });
  };
  return (
    <>
      <div className="absolute flex top-5 left-5 gap-2">
        <Button
          onClick={() => handleSignImageButtonClick("sign_home")}
          className={`border-2 border-white shadow ${
            signImageModule === "sign_home"
              ? "bg-[#0080ff] text-white"
              : "bg-white"
          }`}
          radius="full"
          size="sm"
          startContent={<TbHome size={16} />}
        >
          里世界
        </Button>
        <Button
          onClick={() => handleSignImageButtonClick("sign_play")}
          className={`border-2 border-white shadow ${
            signImageModule === "sign_play"
              ? "bg-[#ff8024] text-white"
              : "bg-white"
          }`}
          radius="full"
          size="sm"
          startContent={<TbDeviceGamepad2 size={16} />}
        >
          游戏
        </Button>
        <Button
          onClick={() => handleSignImageButtonClick("sign_gold")}
          className={`border-2 border-white shadow ${
            signImageModule === "sign_gold"
              ? "bg-[#eeb902] text-white"
              : "bg-white"
          }`}
          radius="full"
          size="sm"
          startContent={<TbPennant2 size={16} />}
        >
          活动
        </Button>
        <Button
          onClick={handleToggleShowSignImage}
          isIconOnly
          className={`border-2 border-white shadow ${
            isShowSignImage ? "bg-white" : "bg-primary text-white"
          }`} // 根据状态切换颜色
          radius="full"
          size="sm"
          startContent={
            isShowSignImage ? <TbEye size={16} /> : <TbEyeOff size={16} />
          }
        />
      </div>
      <div className="absolute flex top-5 right-5 gap-2">
        <AuthButtonClient session={session} />
      </div>
      <div className={`${styles["right-tool-view"]} right-5 bottom-5`}>
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
    </>
  );
}
