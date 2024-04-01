"use client";
import style from "./index.css";
import React from "react";
import { useElementStore } from "@/components/SocketManager";
import NumInput from "@/components/utils/NumInput";

export const Position = ({ handleUpdate }) => {
  // 鼠标可操作阶段
  const [target, setTarget] = useElementStore((state) => [
    state.target,
    state.setTarget,
  ]);

  return (
    <>
      <label className="text-xs">Position</label>
      <div className="inputGroup">
        <NumInput
          value={target.object.position.x}
          onUpdate={(value) => handleUpdate(value, "position", "x")}
          prefix="X"
          suffix="m"
          step={0.1}
        />
        <NumInput
          value={target.object.position.y}
          onUpdate={(value) => handleUpdate(value, "position", "y")}
          prefix="Y"
          suffix="m"
          step={0.1}
        />
        <NumInput
          value={target.object.position.z}
          onUpdate={(value) => handleUpdate(value, "position", "z")}
          prefix="Z"
          suffix="m"
          step={0.1}
        />
      </div>
    </>
  );
};
