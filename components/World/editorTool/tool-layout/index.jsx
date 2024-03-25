"use client";
import style from "./index.css";
import React, { useEffect, useRef } from "react";
import { useAtom } from "jotai";
import { HandToolSvg, SelectToolSvg } from "../../../icons";
import { StoreSvg } from "@/components/utils/icons";
import { TbArrowForwardUp, TbArrowBackUp } from "react-icons/tb";
import { BsMagic } from "react-icons/bs";
import { LuTableProperties } from "react-icons/lu";
import {
  controlStatusAtom,
  useToolStore,
  useTemporalStore,
} from "@/components/SocketManager";
import { HiMiniPlus } from "react-icons/hi2";
import { ToolPopupView } from "@/components/World/editorTool/tool-layout/tool-popup-layout";
import { Image } from "@nextui-org/react";

export const ToolView = () => {
  const popupRef = useRef(null);

  // 鼠标可操作阶段
  const [controlStatus, setControlStatus] = useAtom(controlStatusAtom);

  const { isOpenPopup, setOpenPopup } = useToolStore();
  const { undo, redo } = useTemporalStore((state) => ({
    undo: state.undo,
    redo: state.redo,
  }));

  const handleCheckStage = (stage) => {
    // 默认选择阶段
    setControlStatus((prev) => ({
      ...prev,
      mouseStage: stage,
      defStage: stage,
    }));
  };

  const handleAddBtn = () => {};
  useEffect(() => {
    if (controlStatus.isSpaceDown) {
      setControlStatus((prev) => ({
        ...prev,
        mouseStage: 1,
      }));
    } else {
      if (!controlStatus.isMouseDown) {
        setControlStatus((prev) => ({
          ...prev,
          mouseStage: controlStatus.defStage,
        }));
      }
    }

    if (!controlStatus.isMouseDown && controlStatus.mouseStage == 1) {
      setControlStatus((prev) => ({
        ...prev,
        mouseStage: controlStatus.defStage,
      }));
    }
  }, [controlStatus.isSpaceDown, controlStatus.isMouseDown]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setOpenPopup(false);
      }
    };

    // 添加事件监听器
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // 在组件卸载时移除事件监听器
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpenPopup]);

  return (
    <>
      <div className="bottom-tool user-select-none">
        <div className="bottom-tool-left-box">
          <div
            onClick={() => handleCheckStage(0)}
            className={`${
              controlStatus.mouseStage == 0
                ? "bottom-tool-left-box-itme-active"
                : "bottom-tool-left-box-itme"
            } select-tool rounded-tl-[15px]`}
          >
            <SelectToolSvg />
          </div>
          <div
            onClick={() => handleCheckStage(1)}
            className={`${
              controlStatus.mouseStage == 1
                ? "bottom-tool-left-box-itme-active"
                : "bottom-tool-left-box-itme"
            } rounded-bl-[15px]`}
          >
            <HandToolSvg />
          </div>
        </div>
        <div className="flex items-center px-2 ">
          <div className=" hidden md:flex">
            <div className="bottom-tool-box" onClick={() => undo()}>
              <TbArrowBackUp size={25} />
            </div>

            <div className="bottom-tool-box" onClick={() => redo()}>
              <TbArrowForwardUp size={25} />
            </div>
          </div>

          <div className="bottom-tool-box">
            <BsMagic size={25} />
          </div>

          <div className="bottom-tool-box">
            <LuTableProperties size={25} />
          </div>
        </div>

        <div
          className="bottom-tool-right-box px-3 overflow-hidden select-none"
          onMouseDown={() => !isOpenPopup && setOpenPopup(true)}
        >
          <div className="transform translate-y-[calc(20px)] rotate-[-20deg] w-[55px] h-[55px] z-10 hover:scale-110 focus:scale-110 transition-transform duration-300 ml-2">
            <StoreSvg width={55} height={55} />
          </div>
          <div className="shadow rounded p-2 transform translate-y-[calc(20px)] rotate-[40deg] w-[65px] h-[60px] z-10 hover:scale-110 focus:scale-110 transition-transform duration-300">
            <Image
              className="z-0 w-full user-select-none"
              src="/images/Geometry.png"
            />
          </div>
          <div
            onClick={handleAddBtn}
            className={`bottom-tool-box ${
              isOpenPopup ? "bg-primary text-white" : ""
            }`}
          >
            <HiMiniPlus size={25} />
          </div>
        </div>
        {isOpenPopup && (
          <div className="bottom-tool-popup" ref={popupRef}>
            <ToolPopupView />
          </div>
        )}
      </div>
    </>
  );
};
