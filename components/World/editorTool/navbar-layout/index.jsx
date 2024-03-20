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
import { useElementStore } from "@/components/SocketManager";
import { HiOutlineQueueList } from "react-icons/hi2";
import { TbGrid3X3, TbGridScan } from "react-icons/tb";
import { SaveButton } from "./save-button";
export const Navbar = ({ landInfo }) => {
  const handleWheel = (event) => {
    // 阻止鼠标滚轮事件的默认行为
    event.preventDefault();
  };

  const {
    isOpen: elOpen,
    setOpen,
    isPerspective,
    setPerspective,
  } = useElementStore();

  const handleElementView = () => {
    setOpen(!elOpen);
  };
  const handlePerspective = () => {
    setPerspective(!isPerspective);
  };

  const items = [
    {
      key: "new",
      label: "New file",
    },
    {
      key: "copy",
      label: "Copy link",
    },
    {
      key: "edit",
      label: "Edit file",
    },
    {
      key: "delete",
      label: "Delete file",
    },
  ];

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
            elOpen ? "navbar_box_item_active" : "navbar_box_item"
          } h-[48px] w-[48px] flex items-center px-3 text-[#6B7280]`}
        >
          <HiOutlineQueueList size={20} />
        </div>
        <div
          onClick={handlePerspective}
          className={`navbar_box_item h-[48px] w-[48px] flex items-center px-3`}
        >
          {isPerspective ? <TbGrid3X3 size={20} /> : <TbGridScan size={20} />}
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
                  {landInfo.land_name}
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
          <div className="navbar_item">
            <Dropdown>
              <DropdownTrigger>
                <Button
                  radius="none"
                  className="bg-white text-black border border-conditionalborder-transparent "
                  size="sm"
                >
                  New file
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Dynamic Actions" items={items}>
                {(item) => (
                  <DropdownItem
                    key={item.key}
                    color={item.key === "delete" ? "danger" : "default"}
                    className={item.key === "delete" ? "text-danger" : ""}
                  >
                    {item.label}
                  </DropdownItem>
                )}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>

        <SaveButton landInfo={landInfo} />
        <div className="flex items-center hidden sm:flex">
          <div className="navbar_box_item border-l border-conditionalborder-transparent h-[48px] flex items-center px-3">
            <PlaySvg width={20} height={20} />
          </div>
        </div>
      </div>
    </div>
  );
};
