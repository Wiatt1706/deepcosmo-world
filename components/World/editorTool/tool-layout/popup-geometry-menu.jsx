"use client";
import React from "react";
import { Listbox, ListboxItem } from "@nextui-org/react";
import { useToolStore, useMyStore } from "@/components/SocketManager";
import { TbSphere, TbCylinder, TbCone, TbCube, TbSquare } from "react-icons/tb";
import { uuid } from "uuidv4";

export const GeometryMenu = () => {
  const [modelList, setModelList] = useMyStore((state) => [
    state.modelList,
    state.setModelList,
  ]);
  const setOpenPopup = useToolStore((state) => state.setOpenPopup);

  const itemDataMap = {
    plane: {
      text: "Plane",
      type: "PlaneGeometry",
      position: [0, 2, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      args: [4, 4, 4],
      material_type: "MeshStandardMaterial",
      material_color: "#0070f0",
    },
    cube: {
      text: "Cube",
      type: "BoxGeometry",
      position: [0, 1, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      args: [2, 2, 2],
      material_type: "MeshStandardMaterial",
      material_color: "#0070f0",
    },
    sphere: {
      text: "Sphere",
      type: "SphereGeometry",
      position: [0, 1, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      args: [1, 32, 32],
      material_type: "MeshStandardMaterial",
      material_color: "#0070f0",
    },
    cylinder: {
      text: "Cylinder",
      type: "CylinderGeometry",
      position: [0, 1, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      args: [1, 1, 2],
      material_type: "MeshStandardMaterial",
      material_color: "#0070f0",
    },
    cone: {
      text: "Cone",
      type: "ConeGeometry",
      position: [0, 1, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      args: [1, 2, 32],
      material_type: "MeshStandardMaterial",
      material_color: "#0070f0",
    },
  };

  const handleItemOnClick = (item) => {
    const newItem = itemDataMap[item];
    if (newItem) {
      // 检查 modelList 中是否已存在具有相同文本的项目
      const isDuplicate = modelList.some(
        (model) => model.text === newItem.text
      );

      if (isDuplicate) {
        // 如果存在重复项，则进行处理，这里假设您希望在文本后面添加一个唯一的序号
        let index = 1;
        let uniqueText = newItem.text + ` (${index})`;
        while (modelList.some((model) => model.text === uniqueText)) {
          index++;
          uniqueText = newItem.text + ` (${index})`;
        }
        newItem.text = uniqueText;
      }
      setModelList([
        ...(modelList ?? []),
        { ...newItem, isSelect: true, id: uuid() },
      ]);
      setOpenPopup(false);
    }
  };

  // 重构：提取 ListboxItem 的生成逻辑
  const renderListboxItem = (key, startContent, label) => (
    <ListboxItem
      key={key}
      startContent={<div className="bottom-tool-box">{startContent}</div>}
      onClick={() => handleItemOnClick(key)}
    >
      {label}
    </ListboxItem>
  );

  return (
    <Listbox variant="flat" aria-label="Listbox menu with sections">
      {renderListboxItem("plane", <TbSquare size={25} />, "平面")}
      {renderListboxItem("cube", <TbCube size={25} />, "立方体")}
      {renderListboxItem("sphere", <TbSphere size={25} />, "球体")}
      {renderListboxItem("cylinder", <TbCylinder size={25} />, "圆柱")}
      {renderListboxItem("cone", <TbCone size={25} />, "锥")}
    </Listbox>
  );
};
