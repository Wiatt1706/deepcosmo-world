"use client";
import {
  Avatar,
  AvatarGroup,
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import React, { useState } from "react";
import { ChevronDownIcon } from "../utils/icons";
import { listModelsAtom, useStore } from "@/components/SocketManager";
import { useAtom } from "jotai";

export const Navbar = ({ title }) => {
  const handleWheel = (event) => {
    // 阻止鼠标滚轮事件的默认行为
    event.preventDefault();
  };
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [listModels, setListModels] = useAtom(listModelsAtom);

  const handleSave = async () => {
    try {
      // 执行保存操作
      const { data, error } = await supabase
        .from("block_models")
        .update({ other_column: "otherValue" })
        .eq("some_column", "someValue")
        .select();

      console.log("Save result:", data, error);
    } catch (error) {
      console.error("Save error:", error);
    }
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
                  {title}
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
        <Button
          className="bg-primary text-white border border-conditionalborder-transparent mx-2"
          size="sm"
          radius="none"
          auto
          onPress={onOpen}
        >
          Save
        </Button>
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                保存提醒
              </ModalHeader>
              <ModalBody>
                <p>是否将当前的元素保存至土块（{title}）</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose} onClick={handleSave}>
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
