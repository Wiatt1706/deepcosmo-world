"use client";
import React from "react";
import { Input, Listbox, ListboxItem, Tab, Tabs } from "@nextui-org/react";
import { BiX, BiSearch } from "react-icons/bi";
import { HiXMark } from "react-icons/hi2";
import {
  useBottomToolStore,
  useElementStore,
} from "@/components/SocketManager";
import {
  TbSphere,
  TbCylinder,
  TbCone,
  TbCube,
  TbSquare,
  TbTablePlus,
} from "react-icons/tb";
import { ImportModelSvg } from "@/components/utils/icons";
import { useKeyboardEvent } from "@/components/utils/GeneralEvent";
export const ToolPopupView = () => {
  const { isOpenPopup, setOpenPopup } = useBottomToolStore();
  const modelList = useElementStore((state) => state.modelList);

  useKeyboardEvent("Escape", () => {
    setOpenPopup(false);
  });

  return (
    <>
      <div className="w-full ">
        <div className="flex items-center p-2 mt-1 px-4">
          <Input
            classNames={{
              base: "max-w-full h-10",
              mainWrapper: "h-full",
              input: "text-small",
              inputWrapper:
                "h-full font-normal text-default-500 bg-default-200/40 shadow-none ",
            }}
            clearable
            radius="sm"
            placeholder="search..."
            size="sm"
            startContent={<BiSearch size={18} />}
            type="search"
          />
          <div
            onClick={() => setOpenPopup(false)}
            className="ml-2 text-default-300 h-full flex items-center hover:text-default-500 cursor-pointer rounded-[8px]"
          >
            <HiXMark size={20} />
          </div>
        </div>

        <Tabs
          aria-label="Options"
          color="primary"
          variant="underlined"
          classNames={{
            tabList: "gap-6 w-full relative rounded-none p-0",
            cursor: "w-full bg-primary text-white",
            tab: "max-w-fit px-2 h-12",
            base: "w-full px-4 border-b border-divider",
          }}
        >
          <Tab key="All" title="All" className="p-0">
            <div className="w-full h-[390px] overflow-auto pt-2 text-left">
              <GeometryMenu />
            </div>
          </Tab>
          <Tab key="Templates" title="Templates" className="p-0">
            <div className="w-full h-[390px] overflow-auto pt-2 text-left">
              <div className="bottom-tool-box h-[100px] text-default-400">
                <TbTablePlus size={25} />
              </div>
            </div>
          </Tab>
          <Tab key="Geometry" title="Geometry" className="p-0">
            <div className="w-full h-[390px] overflow-auto pt-2 text-left">
              <GeometryMenu />
            </div>
          </Tab>
          <Tab key="import" title="Import" className="p-0">
            <div className="w-full h-[390px] overflow-auto pt-2 text-left">
              <div className="bottom-tool-box h-[200px] text-default-400">
                <ImportModelSvg width={65} height={65} />
              </div>
            </div>
          </Tab>
        </Tabs>
      </div>
    </>
  );
};

const GeometryMenu = () => {
  const [modelList, setModelList] = useElementStore((state) => [
    state.modelList,
    state.setModelList,
  ]);
  const setOpenPopup = useBottomToolStore((state) => state.setOpenPopup);

  const itemDataMap = {
    plane: {
      id: 2,
      type: "PlaneGeometry",
      position: [0, 2, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      args: [4, 4, 4],
      material_type: "MeshStandardMaterial",
      material_color: "#0070f0",
    },
    cube: {
      id: 3,
      type: "BoxGeometry",
      position: [0, 1, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      args: [2, 2, 2],
      material_type: "MeshStandardMaterial",
      material_color: "#0070f0",
    },
    sphere: {
      id: 4,
      type: "SphereGeometry",
      position: [0, 1, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      args: [2, 32, 32],
      material_type: "MeshStandardMaterial",
      material_color: "#0070f0",
    },
    cylinder: {
      id: 5,
      type: "CylinderGeometry",
      position: [0, 2, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      args: [2, 2, 4],
      material_type: "MeshStandardMaterial",
      material_color: "#0070f0",
    },
    cone: {
      id: 6,
      type: "ConeGeometry",
      position: [0, 2, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      args: [2, 4, 32],
      material_type: "MeshStandardMaterial",
      material_color: "#0070f0",
    },
  };

  const handleItemOnClick = (item) => {
    const newItem = itemDataMap[item];
    if (newItem) {
      setModelList([...modelList, newItem]);
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
