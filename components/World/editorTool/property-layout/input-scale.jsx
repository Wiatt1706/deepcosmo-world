"use client";
import style from "./index.css";
import React from "react";
import { useElementStore } from "@/components/SocketManager";
import NumInput from "@/components/utils/NumInput";

export const Scale = () => {
  // 鼠标可操作阶段
  const [target, setTarget] = useElementStore((state) => [
    state.target,
    state.setTarget,
  ]);
  return (
    <>
      <label className="text-xs">Scale</label>
      <div className="inputGroup">
        <NumInput
          value={target.object.scale.x}
          onUpdate={(value) => {
            target.object.scale.x = value;
          }}
          prefix="X"
          suffix="m"
          step={0.1}
        />
        <NumInput
          value={target.object.scale.y}
          onUpdate={(value) => {
            target.object.scale.y = value;
          }}
          prefix="Y"
          suffix="m"
          step={0.1}
        />
        <NumInput
          value={target.object.scale.z}
          onUpdate={(value) => {
            target.object.scale.z = value;
          }}
          prefix="Z"
          suffix="m"
          step={0.1}
        />
      </div>
    </>
  );
};
