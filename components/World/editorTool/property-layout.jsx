"use client";
import React from "react";
import { useStore } from "@/components/SocketManager";
import NumInput from "@/components/utils/NumInput";

export const InfoView = () => {
  // 鼠标可操作阶段
  const { target, setTarget } = useStore();

  return (
    <>
      {target && (
        <div className="right-tool">
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
          <label className="text-xs">Rotation</label>
          <div className="inputGroup">
            <NumInput
              value={target.object.rotation.x}
              onUpdate={(value) => {
                target.object.rotation.x = value;
              }}
              prefix="X"
              suffix="m"
              step={0.1}
            />
            <NumInput
              value={target.object.rotation.y}
              onUpdate={(value) => {
                target.object.rotation.y = value;
              }}
              prefix="Y"
              suffix="m"
              step={0.1}
            />
            <NumInput
              value={target.object.rotation.z}
              onUpdate={(value) => {
                target.object.rotation.z = value;
              }}
              prefix="Z"
              suffix="m"
              step={0.1}
            />
          </div>

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
        </div>
      )}
    </>
  );
};
