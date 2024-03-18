"use client";
import style from "./index.css";
import React from "react";
import { useStore } from "@/components/SocketManager";
import NumInput from "@/components/utils/NumInput";

export const Position = () => {
  // 鼠标可操作阶段
  const { target, setTarget } = useStore();
  return (
    <>
      <label className="text-xs">Position</label>
      <div className="inputGroup">
        <NumInput
          value={target.object.position.x}
          onUpdate={(value) => {
            target.object.position.x = value;
          }}
          prefix="X"
          suffix="m"
          step={0.1}
        />
        <NumInput
          value={target.object.position.y}
          onUpdate={(value) => {
            target.object.position.y = value;
          }}
          prefix="Y"
          suffix="m"
          step={0.1}
        />
        <NumInput
          value={target.object.position.z}
          onUpdate={(value) => {
            target.object.position.z = value;
          }}
          prefix="Z"
          suffix="m"
          step={0.1}
        />
      </div>
    </>
  );
};
