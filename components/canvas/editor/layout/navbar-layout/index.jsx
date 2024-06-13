"use client";
import style from "./index.css";
import React from "react";
import {
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Link,
} from "@nextui-org/react";
import { ChevronDownIcon, LogoSvg, PlaySvg } from "@/components/utils/icons";
import { useStatusStore } from "@/components/canvas/editor/SocketManager";
import { HiOutlineQueueList, HiAdjustmentsHorizontal } from "react-icons/hi2";
import { TbGrid3X3, TbGridScan } from "react-icons/tb";
export const EdotorNavbar = ({ landWorldInfo }) => {
  console.log("landWorldInfo", landWorldInfo);
  const handleWheel = (event) => {
    // 阻止鼠标滚轮事件的默认行为
    event.preventDefault();
  };

  const [isOpenElement, setOpenElement] = useStatusStore((state) => [
    state.isOpenElement,
    state.setOpenElement,
  ]);

  const handleElementView = () => {
    setOpenElement(!isOpenElement);
  };

  return (
    <div onWheel={handleWheel} className="toolbar_view">
      <div className="flex items-center">
        <div className="border-r border-conditionalborder-transparent  h-[48px] flex items-center px-3">
          <Link href="/">
            <LogoSvg width={25} height={25} />
          </Link>
        </div>

        <div
          onClick={handleElementView}
          className={`${
            isOpenElement ? "navbar_box_item_active" : "navbar_box_item"
          } h-[48px] w-[48px] flex items-center px-3 text-[#6B7280]`}
        >
          <HiOutlineQueueList size={20} />
        </div>

        <div
          className={`navbar_box_item h-[48px] w-[48px] flex items-center px-3 text-[#6B7280]`}
        >
          <HiAdjustmentsHorizontal size={20} />
        </div>
      </div>
      <div>
        <Breadcrumbs
          separator="/"
          itemClasses={{
            separator: "px-2",
          }}
        >
          <BreadcrumbItem>
            <Dropdown>
              <DropdownTrigger>
                <Button
                  className="h-6 pr-2 text-small"
                  endContent={<ChevronDownIcon className="text-default-500" />}
                  radius="full"
                  size="sm"
                  variant="light"
                >
                  {landWorldInfo.name}
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Routes">
                <DropdownItem href="#song-1">更改名称</DropdownItem>
                <DropdownItem href="#song2">升级扩展</DropdownItem>
                <DropdownItem href="#song3">删除</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </BreadcrumbItem>
        </Breadcrumbs>
      </div>
      <div className="flex items-center">
        <div className="flex items-center hidden sm:flex">
          <div className="navbar_box_item border-l border-conditionalborder-transparent h-[48px] flex items-center px-3">
            <PlaySvg width={20} height={20} />
          </div>
        </div>
      </div>
    </div>
  );
};
