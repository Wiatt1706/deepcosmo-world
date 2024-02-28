"use client";
import {
  Avatar,
  AvatarGroup,
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import React, { useState } from "react";
import { ChevronDownIcon } from "../utils/icons";

export const Navbar = () => {
  const handleWheel = (event) => {
    // 阻止鼠标滚轮事件的默认行为
    event.preventDefault();
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
      <div>
        <div>
          <></>
        </div>
        <div className="border-r border-conditionalborder-transparent  h-[48px] flex items-center px-2">
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
      <div>
        <Breadcrumbs
          separator="/"
          itemClasses={{
            separator: "px-2",
          }}
        >
          <BreadcrumbItem>
            <span className="text-default-500">Drafts</span>
          </BreadcrumbItem>
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
                  Untitled
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Routes">
                <DropdownItem href="#song-1">Song 1</DropdownItem>
                <DropdownItem href="#song2">Song 2</DropdownItem>
                <DropdownItem href="#song3">Song 3</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </BreadcrumbItem>
        </Breadcrumbs>
      </div>
      <div className="flex items-center">
        <AvatarGroup max={3} size="sm">
          <Avatar
            className="w-6 h-6 text-tiny"
            src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
          />
          <Avatar
            className="w-6 h-6 text-tiny"
            src="https://i.pravatar.cc/150?u=a04258a2462d826712d"
          />
          <Avatar
            className="w-6 h-6 text-tiny"
            src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
          />
          <Avatar
            className="w-6 h-6 text-tiny"
            src="https://i.pravatar.cc/150?u=a04258114e29026302d"
          />
          <Avatar
            className="w-6 h-6 text-tiny"
            src="https://i.pravatar.cc/150?u=a04258114e29026702d"
          />
          <Avatar
            className="w-6 h-6 text-tiny"
            src="https://i.pravatar.cc/150?u=a04258114e29026708c"
          />
        </AvatarGroup>

        <Button
          className="bg-primary text-white border border-conditionalborder-transparent mx-2"
          size="sm"
        >
          Share
        </Button>
      </div>
    </div>
  );
};
