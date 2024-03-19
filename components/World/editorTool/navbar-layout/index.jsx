"use client";
import style from "./index.css";
import {
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
import React from "react";
import { ChevronDownIcon, LogoSvg, PlaySvg } from "@/components/utils/icons";
import { useElementStore } from "@/components/SocketManager";
import { HiOutlineQueueList } from "react-icons/hi2";
import { TbGrid3X3, TbGridScan } from "react-icons/tb";

export const Navbar = ({ landInfo }) => {
  const handleWheel = (event) => {
    // 阻止鼠标滚轮事件的默认行为
    event.preventDefault();
  };
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: elOpen,
    setOpen,
    isPerspective,
    setPerspective,
    modelList,
    sceneList,
  } = useElementStore();

  const handleElementView = () => {
    setOpen(!elOpen);
  };
  const handlePerspective = () => {
    setPerspective(!isPerspective);
  };

  const fetchData = async (models) => {
    try {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...landInfo, models }), // 传入一个对象
      };

      const res = await fetch("/api/land", requestOptions);
      const data = await res.json();
      console.log("Fetch data:", data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSave = async () => {
    try {
      sceneList.forEach((sceneItem) => {
        const { userData, position, rotation, scale } = sceneItem;
        if (userData && userData.primaryId) {
          const matchingModel = modelList.find(
            (modelItem) => modelItem.id === userData.primaryId
          );
          if (matchingModel) {
            // 将 position、rotation 和 scale 转换为数组格式，记录其 xyz 值
            const newPosition = [position.x, position.y, position.z];
            const newRotation = [rotation._x, rotation._y, rotation._z];
            const newScale = [scale.x, scale.y, scale.z];

            // 更新匹配的 modelList 元素的数据
            matchingModel.position = newPosition;
            matchingModel.rotation = newRotation;
            matchingModel.scale = newScale;
          }
        }
      });

      await fetchData(modelList);
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
      <div className="flex items-center">
        <div className="border-r border-conditionalborder-transparent  h-[48px] flex items-center px-3">
          <LogoSvg width={25} height={25} />
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
          {/* <BreadcrumbItem>
            <span className="text-default-500">Drafts</span>
          </BreadcrumbItem> */}
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

        <Button
          className="bg-primary text-white border border-conditionalborder-transparent mx-2"
          size="sm"
          radius="none"
          auto
          onPress={onOpen}
        >
          Save
        </Button>
        <div className="flex items-center hidden sm:flex">
          <div className="navbar_box_item border-l border-conditionalborder-transparent h-[48px] flex items-center px-3">
            <PlaySvg width={20} height={20} />
          </div>
        </div>
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                保存提醒
              </ModalHeader>
              <ModalBody>
                <p>是否将当前的元素保存至土块（{landInfo.land_name}）</p>
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
