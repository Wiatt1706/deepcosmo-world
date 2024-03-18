"use client";
import style from "./index.css";
import React from "react";
import { useStore } from "@/components/SocketManager";
import { DegreeNumInput } from "@/components/utils/NumInput";

export const Rotation = () => {
  // 鼠标可操作阶段
  const { target, setTarget } = useStore();
  return (
    <>
      <label className="text-xs">Rotation</label>
      <div className="inputGroup">
        <DegreeNumInput
          value={target.object.rotation.x}
          onUpdate={(value) => {
            target.object.rotation.x = value;
          }}
          prefix="X"
          suffix="&deg;"
          step={1}
        />
        <DegreeNumInput
          value={target.object.rotation.y}
          onUpdate={(value) => {
            target.object.rotation.y = value;
          }}
          prefix="Y"
          suffix="&deg;"
          step={1}
        />
        <DegreeNumInput
          value={target.object.rotation.z}
          onUpdate={(value) => {
            target.object.rotation.z = value;
          }}
          prefix="Z"
          suffix="&deg;"
          step={1}
        />
      </div>
    </>
  );
};
