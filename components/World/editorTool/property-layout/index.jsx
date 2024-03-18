"use client";
import style from "./index.css";
import React from "react";
import { useStore, useElementStore } from "@/components/SocketManager";
import { useKeyboardEvent } from "@/components/utils/GeneralEvent";
import { Position } from "./input-position";
import { Scale } from "./input-scale";
import { Rotation } from "./input-rotation";
import { Input } from "@nextui-org/react";
import { Color } from "three";
import { useState } from "react";

export const InfoView = () => {
  // 鼠标可操作阶段
  const { target, setTarget } = useStore();
  const [color, setColor] = useState("#000000");

  // 获取颜色值对象
  const colorValue = target?.object?.material.color;

  const [modelList, setModelList] = useElementStore((state) => [
    state.modelList,
    state.setModelList,
  ]);

  const handleColorChange = (e) => {
    const newColor = e.target.value;
    setColor(newColor);

    // 更新 target 对象的颜色
    if (target && target.object) {
      target.object.material.color = new Color(newColor);
    }

    // 更新 modelList 中目标对象的 material_color 属性
    if (target && target.id) {
      const updatedModelList = modelList.map((item) => {
        if (item.id === target.id) {
          item.material_color = newColor;
        }
        return item;
      });
      setModelList(updatedModelList);
    }
  };

  useKeyboardEvent("Delete", () => {
    if (target) {
      const updatedModelList = modelList.filter(
        (item) => item.id !== target.id
      );
      // 更新状态以反映已删除的数据
      setModelList(updatedModelList);
      setTarget(null);
    }
  });

  return (
    <>
      {target && target.object && (
        <div className="right-tool">
          <Position />
          <Rotation />
          <Scale />

          <label className="text-xs">Color</label>
          <div>
            <Input
              type={"color"}
              value={
                "#" +
                new Color(
                  colorValue.r,
                  colorValue.g,
                  colorValue.b
                ).getHexString()
              }
              onChange={handleColorChange}
            />
          </div>
        </div>
      )}
    </>
  );
};
