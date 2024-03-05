"use client";
import React, { useEffect, useState } from "react";
import { atom, useAtom } from "jotai";
import { HandToolSvg, PenToolSvg, SelectToolSvg } from "../icons";
import { TbBrandAirtable } from "react-icons/tb";
import { FaCode } from "react-icons/fa6";
import { BsMagic } from "react-icons/bs";
import { LuTableProperties } from "react-icons/lu";
import { controlStatusAtom, mouseStageAtom } from "@/components/SocketManager";
import { useStore } from "@/components/SocketManager";
import NumInput from "@/components/comment-editor/NumInput";

export const ToolView = () => {
  const { target, setTarget } = useStore();
  // 鼠标可操作阶段
  const [mouseStage, setMouseStage] = useAtom(mouseStageAtom);
  const [controlStatus, setControlStatus] = useAtom(controlStatusAtom);

  const handleCheckStage = (stage) => {
    setMouseStage(stage);
    // 默认选择阶段
    setControlStatus((prev) => ({ ...prev, defStage: stage }));
  };

  useEffect(() => {
    if (controlStatus.isSpaceDown) {
      setMouseStage(1);
    } else {
      if (!controlStatus.isMouseDown) {
        setMouseStage(controlStatus.defStage);
      }
    }

    if (!controlStatus.isMouseDown && mouseStage == 1) {
      setMouseStage(controlStatus.defStage);
    }
  }, [controlStatus.isSpaceDown, controlStatus.isMouseDown]);

  return (
    <>
      <div className="bottom-tool">
        <div className="bottom-tool-left-box">
          <div
            onClick={() => handleCheckStage(0)}
            className={`${
              mouseStage == 0
                ? "bottom-tool-left-box-itme-active"
                : "bottom-tool-left-box-itme"
            } select-tool rounded-tl-[20px]`}
          >
            <SelectToolSvg />
          </div>
          <div
            onClick={() => handleCheckStage(1)}
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

      {target && (
        <div className="right-tool">
          <label className="text-xs">Position</label>
          <div className="inputGroup">
            <NumInput
              value={target.object.position.x}
              prefix="X"
              suffix="m"
              step={0.1}
            />
            <NumInput
              value={target.object.position.y}
              prefix="Y"
              suffix="m"
              step={0.1}
            />
            <NumInput
              value={target.object.position.z}
              prefix="Z"
              suffix="m"
              step={0.1}
            />
          </div>
          <label className="text-xs">Rotation</label>
          <div className="inputGroup">
            <NumInput
              value={target.object.rotation.x}
              prefix="X"
              suffix="m"
              step={0.1}
            />
            <NumInput
              value={target.object.rotation.y}
              prefix="Y"
              suffix="m"
              step={0.1}
            />
            <NumInput
              value={target.object.rotation.z}
              prefix="Z"
              suffix="m"
              step={0.1}
            />
          </div>
        </div>
      )}
    </>
  );
};
