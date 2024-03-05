"use client";
import React, { useEffect, useState } from "react";
import { listModelsAtom, useStore } from "@/components/SocketManager";
import NumInput from "@/components/comment-editor/NumInput";
import { BiChevronRight, BiChevronLeft } from "react-icons/bi";

export const InfoView = () => {
  // 鼠标可操作阶段
  const { target, setTarget } = useStore();
  
  return (
    <>
      {target && (
        <div className="right-tool">
          <label className="text-xs">Position</label>
          <div className="inputGroup">
            <NumInput value={0.43} prefix="X" suffix="m" step={0.1} />
            <NumInput value={0.43} prefix="Y" suffix="m" step={0.1} />
            <NumInput value={0.43} prefix="Z" suffix="m" step={0.1} />
          </div>
          <label className="text-xs">Position</label>
          <div className="inputGroup">
            <NumInput value={0.43} prefix="X" suffix="m" step={0.1} />
            <NumInput value={0.43} prefix="Y" suffix="m" step={0.1} />
            <NumInput value={0.43} prefix="Z" suffix="m" step={0.1} />
          </div>
        </div>
      )}
    </>
  );
};
