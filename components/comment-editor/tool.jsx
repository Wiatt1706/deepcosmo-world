"use client";
import React, { useEffect, useState } from "react";
import { atom, useAtom } from "jotai";
import { HandToolSvg, PenToolSvg, SelectToolSvg } from "../icons";
import { TbBrandAirtable } from "react-icons/tb";
import { FaCode } from "react-icons/fa6";
import { BsMagic } from "react-icons/bs";
import { LuTableProperties } from "react-icons/lu";

export const mouseStageAtom = atom(0);
export const isEnablePanAtom = atom(false);
export const ToolView = () => {
  // 鼠标可操作阶段
  const [mouseStage, setMouseStage] = useAtom(mouseStageAtom);
  const [isEnablePan, setIsEnablePan] = useAtom(isEnablePanAtom);
  const [isMouseDown, setIsMouseDown] = useState(false);

  const handlemouseStage = (stage) => {
    setMouseStage(stage);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === "Space") {
        setIsEnablePan(true);
        handlemouseStage(1);
      }
    };

    const handleKeyUp = (event) => {
      if (event.code === "Space") {
        handlemouseStage(0);

        if (!isMouseDown) {
          setIsEnablePan(false);
        }
      }
    };

    const handleMouseDown = () => {
      setIsMouseDown(true);
    };

    const handleMouseUp = () => {
      setIsMouseDown(false);
      if (isEnablePan) {
        // If Pan is enabled and mouse left button is released, disable Pan
        setIsEnablePan(false);
        handlemouseStage(0);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isEnablePan, isMouseDown]); // Add isEnablePan as a dependency

  return (
    <div className="bottom-tool">
      <div className="bottom-tool-left-box">
        <div
          onClick={() => handlemouseStage(0)}
          className={`${
            mouseStage == 0
              ? "bottom-tool-left-box-itme-active"
              : "bottom-tool-left-box-itme"
          } select-tool rounded-tl-[20px]`}
        >
          <SelectToolSvg />
        </div>
        <div
          onClick={() => handlemouseStage(1)}
          className={`${
            mouseStage == 1
              ? "bottom-tool-left-box-itme-active"
              : "bottom-tool-left-box-itme"
          } rounded-bl-[20px]`}
        >
          <HandToolSvg />
        </div>
      </div>

      <div className="pen-Tool px-2">
        <PenToolSvg />
      </div>

      <div className="px-2">
        <div className="bottom-tool-box">
          <TbBrandAirtable size={25} />
        </div>
      </div>

      <div className="px-2">
        <div className="bottom-tool-box">
          <FaCode size={25} />
        </div>
      </div>

      <div className="px-2">
        <div className="bottom-tool-box">
          <BsMagic size={25} />
        </div>
      </div>

      <div className="px-2">
        <div className="bottom-tool-box">
          <LuTableProperties size={25} />
        </div>
      </div>
    </div>
  );
};
