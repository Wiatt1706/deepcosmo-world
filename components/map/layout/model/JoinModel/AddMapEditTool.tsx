import React, { useEffect } from "react";
import { NumInput } from "@/components/utils/NumInput";
import styles from "@/styles/canvas/ViewEditTool.module.css";
import { TbResize } from "react-icons/tb";
import { LiLandsBoxSvg } from "@/components/utils/icons";
import { useAtomValue } from "jotai";
import { userDataAtom } from "@/components/layout/auth-button-client";

export default function AddMapEditTool({
  toolInfo,
  setToolInfo,
}: {
  toolInfo: any;
  setToolInfo: any;
}) {
  const userData = useAtomValue(userDataAtom);

  useEffect(() => {
    setToolInfo({
      ...toolInfo,
      editable:
        toolInfo.brushSize * toolInfo.brushSize <= (userData?.land_coins ?? 0),
    });
  }, [toolInfo.brushSize, userData?.land_coins]);
  return (
    <div
      tabIndex={-1} // 使元素可以聚焦
      style={{ outline: "none" }}
      className={styles["edit-view"]}
    >
      <div className="flex gap-1 justify-between items-center w-full">
        <div className="flex">
          <div className="flex justify-between items-center mx-2">
            <div className="flex gap-1 justify-between items-center">
              <TbResize size={20} />
              BrushSize：
            </div>
            <div className="flex gap-1 justify-between items-center bg-[#f3f6f8] rounded-[8px] py-[6px]">
              <NumInput
                value={toolInfo.brushSize}
                onUpdate={(value) => {
                  setToolInfo({
                    ...toolInfo,
                    brushSize: value,
                  });
                }}
                precision={0}
                prefix={`${toolInfo.brushSize}x`}
                suffix={
                  <div className="flex items-center text-[10px] ml-4 gap-1">
                    <span
                      style={{
                        letterSpacing: "1px",
                        color:
                          toolInfo.brushSize * toolInfo.brushSize >
                          (userData?.land_coins ?? 0)
                            ? "#C20E4D" // Warning color
                            : "black", // Default color
                      }}
                    >
                      {toolInfo.brushSize * toolInfo.brushSize}/
                      {userData?.land_coins ?? 0}
                    </span>
                    <LiLandsBoxSvg width={12} height={12} />
                  </div>
                }
                maxValue={10}
                minValue={1}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2 px-4 text-[10px] text-[#63727e]">
          <div className="flex gap-1 justify-between items-center">
            <div className="w-3 h-3 rounded-full bg-[#dadddf]" />
            <span>待售出</span>
          </div>
          <div className="flex gap-1 justify-between items-center">
            <div className="w-3 h-3 rounded-full bg-[#28d3b1]" />
            <span>我的</span>
          </div>

          <div className="flex gap-1 justify-between items-center">
            <div className="w-3 h-3 rounded-full bg-[#0070f0]" />
            <span>已选择</span>
          </div>
        </div>
      </div>
    </div>
  );
}
