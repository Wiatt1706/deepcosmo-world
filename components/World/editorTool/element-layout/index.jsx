"use client";
import { useState } from "react";
import style from "./index.css";
import {
  useMyStore,
  useElementStore,
  useToolStore,
} from "@/components/SocketManager";
import Tree from "@/components/utils/Tree";
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
} from "@nextui-org/react";
import { BiBox, BiSearch, BiChevronDown } from "react-icons/bi";
import { GrTree } from "react-icons/gr";
import { MdOutlineLightbulb } from "react-icons/md";
import { PiCompassTool } from "react-icons/pi";
import {
  TbSphere,
  TbCylinder,
  TbCone,
  TbCube,
  TbSquare,
  TbPackageImport,
  TbListDetails,
  TbVectorTriangle,
} from "react-icons/tb";
import {
  EyeBtn,
  LoacationBtn,
  ExportBtn,
} from "@/components/World/editorTool/element-layout/element-util";

function convertSceneListToTreeNode(object) {
  const { name, type, children } = object;
  const treeData = {
    label: name || type,
    children: children ? children.map(convertSceneListToTreeNode) : [],
  };

  switch (type) {
    case "Mesh":
      treeData.startContent = <TbVectorTriangle size={16} />;
      treeData.isEye = true;
      break;
    case "Group":
      treeData.startContent = <BiBox size={16} />;
      treeData.isEye = true;
      break;
    case "AmbientLight":
      treeData.startContent = <MdOutlineLightbulb size={16} />;
      break;
    case "AxesHelper":
    case "GridHelper":
      treeData.startContent = <PiCompassTool size={16} />;
      break;
    default:
      break;
  }

  return treeData;
}

function convertModelListToTreeNode(object, target, isParent = true) {
  const { name, type, id, children, model } = object;
  const treeData = {
    id,
    label: name || type,
    children: children
      ? children.map((child) =>
          convertModelListToTreeNode(child, target, false)
        )
      : [],
  };

  if (isParent) {
    switch (model) {
      case "BoxGeometry":
        treeData.startContent = <TbCube size={16} />;
        break;
      case "SphereGeometry":
        treeData.startContent = <TbSphere size={16} />;
        break;
      case "CylinderGeometry":
        treeData.startContent = <TbCylinder size={16} />;
        break;
      case "PlaneGeometry":
        treeData.startContent = <TbSquare size={16} />;
        break;
      case "ConeGeometry":
        treeData.startContent = <TbCone size={16} />;
        break;
      case "ImportGeometry":
        treeData.startContent = <TbPackageImport size={16} />;
        break;
      // Add more geometry types here if needed
      default:
        break;
    }
  } else {
    switch (type) {
      case "Mesh":
        treeData.startContent = <TbVectorTriangle size={16} />;
        treeData.isEye = true;
        break;
      case "Group":
        treeData.startContent = <BiBox size={16} />;
        treeData.isEye = true;
        break;
      case "AmbientLight":
        treeData.startContent = <MdOutlineLightbulb size={16} />;
        break;
      case "AxesHelper":
      case "GridHelper":
        treeData.startContent = <PiCompassTool size={16} />;
        break;
      default:
        break;
    }
  }

  if (target?.id === id) {
    treeData.isSelect = true;
  }
  treeData.toolList = [
    <EyeBtn key={`eye_${id}`} id={id} />,
    <ExportBtn key={`export_${id}`} mesh={id} />,
    <LoacationBtn key={`location_${id}`} id={id} />,
  ];
  return treeData;
}

export const ElementView = () => {
  const modelList = useMyStore((state) => state.modelList);
  const [target, sceneList] = useElementStore((state) => [
    state.target,
    state.sceneList,
  ]);
  const isOpenElement = useToolStore((state) => state.isOpenElement);
  const [selectedOption, setSelectedOption] = useState(new Set(["asset"]));

  const treeMap = {
    scene: {
      label: "场景",
      icon: <GrTree />,
      description: "包括整个场景的物体树结构",
      convertFunction: convertSceneListToTreeNode,
      data: sceneList,
    },
    asset: {
      label: "资产",
      icon: <TbListDetails />,
      description: "当前已加载的可用资源",
      convertFunction: convertModelListToTreeNode,
      data: modelList,
    },
  };

  const treeView = () => {
    const { label, convertFunction, data } =
      treeMap[selectedOption.values().next().value];

    return (
      <div className="w-full h-full overflow-y-auto">
        <div className="flex items-center hover:bg-gray-200 w-full px-2">
          <span className="flex items-center p-1">
            <Chip startContent={<BiBox size={18} />} variant="light">
              {label}
            </Chip>
          </span>
        </div>
        <Tree data={data.map((item) => convertFunction(item, target))} />
      </div>
    );
  };

  return (
    <>
      {isOpenElement && (
        <div className="left-tool">
          <div className="flex items-center bg-default-100/10">
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Button
                  className="pl-2"
                  isIconOnly
                  color="default"
                  variant="light"
                  radius="none"
                >
                  {treeMap[selectedOption.values().next().value].icon}
                  <BiChevronDown size={16} />
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Merge options"
                selectedKeys={selectedOption}
                selectionMode="single"
                onSelectionChange={setSelectedOption}
                className="max-w-[300px]"
              >
                <DropdownItem
                  key="asset"
                  startContent={treeMap["asset"].icon}
                  description={treeMap["asset"].description}
                >
                  {treeMap["asset"].label}
                </DropdownItem>
                <DropdownItem
                  key="scene"
                  startContent={treeMap["scene"].icon}
                  description={treeMap["scene"].description}
                >
                  {treeMap["scene"].label}
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <Input
              classNames={{
                base: "max-w-full h-10",
                mainWrapper: "h-full",
                input: "text-small",
                inputWrapper:
                  "h-full font-normal text-default-500 bg-default-100/10 shadow-none rounded-none",
              }}
              clearable
              radius="none"
              placeholder="search..."
              size="sm"
              startContent={<BiSearch size={18} />}
              type="search"
            />
          </div>
          <div className="flex flex-col">{treeView()}</div>
        </div>
      )}
    </>
  );
};
