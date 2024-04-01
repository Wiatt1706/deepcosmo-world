"use client";
import style from "./index.css";
import React from "react";
import { useElementStore } from "@/components/SocketManager";
import { DegreeNumInput } from "@/components/utils/NumInput";

export const Rotation = ({ handleUpdate }) => {
  // 鼠标可操作阶段
  const [target, setTarget] = useElementStore((state) => [
    state.target,
    state.setTarget,
  ]);
  return (
    <>
      <label className="text-xs">Rotation</label>
      <div className="inputGroup">
        <DegreeNumInput
          value={target.object.rotation.x}
          onUpdate={(value) => handleUpdate(value, "rotation", "x")}
          prefix="X"
          suffix="&deg;"
          step={1}
        />
        <DegreeNumInput
          value={target.object.rotation.y}
          onUpdate={(value) => handleUpdate(value, "rotation", "y")}
          prefix="Y"
          suffix="&deg;"
          step={1}
        />
        <DegreeNumInput
          value={target.object.rotation.z}
          onUpdate={(value) => handleUpdate(value, "rotation", "z")}
          prefix="Z"
          suffix="&deg;"
          step={1}
        />
      </div>
    </>
  );
};
