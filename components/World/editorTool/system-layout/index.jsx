"use client";
import style from "./index.css";
import React, { useEffect, useRef } from "react";
import { useToolStore, useMyStore } from "@/components/SocketManager";
import { Input } from "@nextui-org/input";
import {
  TbBrandNuxt,
  TbCamera,
  TbBrightnessUp,
  TbCheck,
  TbPalette,
  TbBrandDenodo,
  TbGrid4X4,
} from "react-icons/tb";
import { HiXMark } from "react-icons/hi2";
import { Switch } from "@nextui-org/switch";
import { cn } from "@nextui-org/system";
import { Select, SelectItem } from "@nextui-org/react";
import { SwitchBtn } from "./SwitchBtn";

export const SystemView = () => {
  const popupRef = useRef(null);

  const [systemInfo, setSystemInfo] = useMyStore((state) => [
    state.systemInfo,
    state.setSystemInfo,
  ]);

  const { isOpenSystemSet, setSystemSet } = useToolStore();

  const evnList = [
    {
      label: "sunset",
      value: "sunset",
    },
    {
      label: "dawn",
      value: "dawn",
    },
    {
      label: "night",
      value: "night",
    },
    {
      label: "warehouse",
      value: "warehouse",
    },
    {
      label: "forest",
      value: "forest",
    },
    {
      label: "apartment",
      value: "apartment",
    },
    {
      label: "studio",
      value: "studio",
    },
    {
      label: "city",
      value: "city",
    },
    {
      label: "park",
      value: "park",
    },
    {
      label: "lobby",
      value: "lobby",
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setSystemSet(false);
      }
    };

    // 添加事件监听器
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // 在组件卸载时移除事件监听器
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpenSystemSet]);

  return (
    <>
      <div className="system-popup h-[500px]" ref={popupRef}>
        <div className="flex items-center p-2 px-4 w-full justify-between bg-white h-[40px]">
          <span>场景设置</span>
          <div
            onClick={() => setSystemSet(false)}
            className="ml-2 text-default-300 h-full flex items-center hover:text-default-500 cursor-pointer rounded-[8px]"
          >
            <HiXMark size={20} />
          </div>
        </div>

        <div
          className="w-full overflow-y-auto flex flex-wrap px-4"
          style={{ maxHeight: "calc(100% - 40px)" }}
        >
          <div className="w-full py-2">
            <Input
              type="color"
              label="场景颜色"
              placeholder="请输入场景颜色"
              labelPlacement="outside"
              startContent={<TbPalette size={18} />}
              value={systemInfo.color}
              onChange={(e) => setSystemInfo("sceneColor", e.target.value)}
            />
          </div>
          <div className="w-full py-2">
            <Select
              label="场景背景"
              placeholder="选择背景"
              labelPlacement="outside"
              startContent={<TbBrandNuxt size={18} />}
              defaultSelectedKeys={[systemInfo.sceneEvn]}
              onChange={(e) => setSystemInfo("sceneEvn", e.target.value)}
            >
              {evnList.map((animal) => (
                <SelectItem key={animal.value} value={animal.value}>
                  {animal.label}
                </SelectItem>
              ))}
            </Select>
          </div>

          <div className="w-full py-2">
            <SwitchBtn
              title={"开启网格效果"}
              value={systemInfo.openGrid}
              onChange={(value) => setSystemInfo("openGrid", value)}
              icon={<TbGrid4X4 size={18} />}
            />
          </div>

          <div className="w-full py-2">
            <SwitchBtn
              title={"开启物理效果"}
              value={systemInfo.physics}
              onChange={(value) => setSystemInfo("physics", value)}
              icon={<TbBrightnessUp size={18} />}
            />
          </div>
          <div className="w-full py-2">
            <SwitchBtn
              title={"开启迷雾效果"}
              value={systemInfo.sceneFog}
              onChange={(value) => setSystemInfo("sceneFog", value)}
              icon={<TbBrandDenodo size={18} />}
            />
          </div>
          <div className="w-full py-2 flex justify-between">
            <div>
              <SwitchBtn
                title={"开启迷雾效果"}
                value={systemInfo.sceneFog}
                onChange={(value) => setSystemInfo("sceneFog", value)}
                icon={<TbBrandDenodo size={18} />}
              />
            </div>
            <div>
              <SwitchBtn
                title={"开启迷雾效果"}
                value={systemInfo.sceneFog}
                onChange={(value) => setSystemInfo("sceneFog", value)}
                icon={<TbBrandDenodo size={18} />}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
