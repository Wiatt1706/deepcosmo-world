"use client";
import style from "./index.css";
import React from "react";
import { useMyStore, useElementStore } from "@/components/SocketManager";
import { Position } from "./input-position";
import { Scale } from "./input-scale";
import { Rotation } from "./input-rotation";
import { Input } from "@nextui-org/react";
import { Color } from "three";
import { useState } from "react";

export const InfoView = () => {
  // 鼠标可操作阶段
  const [color, setColor] = useState("#000000");

  const [modelList, setModelList] = useMyStore((state) => [
    state.modelList,
    state.setModelList,
  ]);
  let updateTimeout = null;
  const target = useElementStore((state) => state.target);
  // 获取颜色值对象
  const colorValue = target?.object?.material.color;
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

  const handleUpdate = (value, type, axis) => {
    switch (type) {
      case "position":
        target.object.position[axis] = parseFloat(value.toFixed(2));
        break;
      case "rotation":
        target.object.rotation[axis] = parseFloat(value.toFixed(2));
        break;
      case "scale":
        target.object.scale[axis] = parseFloat(value.toFixed(2));
        break;
      default:
        break;
    }
    // 清除之前的计时器
    if (updateTimeout) {
      clearTimeout(updateTimeout);
    }
    // 设置新的计时器
    const timeoutId = setTimeout(() => {
      // 更新模型列表
      const updatedModelList = updateModelListRecursively(
        modelList,
        target.id,
        {
          position: target.object.position.toArray(),
          rotation: target.object.rotation.toArray(),
          scale: target.object.scale.toArray(),
        }
      );
      setModelList(updatedModelList);
    }, 600); // 2秒内的更新只以最后一次为准

    updateTimeout = timeoutId;
  };

  const updateModelListRecursively = (
    modelList,
    targetId,
    updatedProperties
  ) => {
    return modelList.map((model) => {
      if (model.id === targetId) {
        // 更新目标模型的属性
        return {
          ...model,
          ...updatedProperties,
        };
      } else if (model.children && model.children.length > 0) {
        // 如果模型具有子节点，则递归更新子节点
        return {
          ...model,
          children: updateModelListRecursively(
            model.children,
            targetId,
            updatedProperties
          ),
        };
      }
      return model;
    });
  };

  return (
    <>
      {target && target.object && (
        <div className="right-tool">
          <Position handleUpdate={handleUpdate} />
          <Rotation handleUpdate={handleUpdate} />
          <Scale handleUpdate={handleUpdate} />

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
