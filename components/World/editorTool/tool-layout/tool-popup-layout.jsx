"use client";
import React from "react";
import { Input, Tab, Tabs } from "@nextui-org/react";
import { BiSearch } from "react-icons/bi";
import { HiXMark } from "react-icons/hi2";
import { useToolStore } from "@/components/SocketManager";
import { TbTablePlus } from "react-icons/tb";
import { GeometryMenu } from "./popup-geometry-menu";
import { ImportMenu } from "./popup-import-menu";

export const ToolPopupView = () => {
  const { isOpenPopup, setOpenPopup } = useToolStore();

  return (
    <>
      <div className="w-full user-select-none">
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
            <div className="w-full h-[390px] overflow-auto text-left">
              <ImportMenu />
            </div>
          </Tab>
        </Tabs>
      </div>
    </>
  );
};
