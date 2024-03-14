"use client";
import { useState, useEffect } from "react";
import style from "./index.css";
import { useElementStore } from "@/components/SocketManager";
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
import {
  BiCube,
  BiBox,
  BiSearch,
  BiFilterAlt,
  BiChevronDown,
} from "react-icons/bi";
import { MdOutlineLightbulb } from "react-icons/md";
import { PiCompassTool } from "react-icons/pi";
function convertObjectToTreeNode(object) {
  const { name, type, children } = object;
  const treeData = {
    label: name || type,
    children: children ? children.map(convertObjectToTreeNode) : [],
  };

  switch (type) {
    case "Mesh":
      treeData.startContent = <BiCube size={16} />;
      treeData.isEye = true;
      break;
    case "Group":
      treeData.startContent = <BiBox size={16} />;
      treeData.isEye = true;
      break;
    case "AmbientLight":
      treeData.startContent = <MdOutlineLightbulb size={16} />;
      treeData.isEye = true;
      break;
    case "AxesHelper":
    case "GridHelper":
      treeData.startContent = <PiCompassTool size={16} />;
      treeData.isEye = true;
      break;
    default:
      break;
  }

  return treeData;
}

export const ElementView = () => {
  const { isOpen, setOpen, sceneList } = useElementStore();

  const [treeData, setTreeData] = useState([]);

  const [selectedOption, setSelectedOption] = useState(new Set(["merge"]));

  const descriptionsMap = {
    merge: "merge.",
    squash: "squash.",
    rebase: "rebase.",
  };

  const labelsMap = {
    merge: "Create a merge commit",
    squash: "Squash and merge",
    rebase: "Rebase and merge",
  };

  useEffect(() => {
    const rootNodes = sceneList.map(convertObjectToTreeNode);
    setTreeData(rootNodes);
  }, [sceneList]);

  return (
    <>
      {isOpen && (
        <div className="left-tool">
          <div className="flex items-center bg-default-100/10">
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Button
                  isIconOnly
                  color="default"
                  variant="light"
                  radius="none"
                >
                  <BiChevronDown />
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
                  key="merge"
                  description={descriptionsMap["merge"]}
                >
                  {labelsMap["merge"]}
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
            <div className="p-2 text-default-500 h-full flex items-center">
              <BiFilterAlt size={18} />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center hover:bg-gray-200 w-full px-2">
              <span className="flex items-center p-1">
                <Chip startContent={<BiBox size={18} />} variant="light">
                  场景集合
                </Chip>
              </span>
            </div>
            <Tree data={treeData} />
          </div>
        </div>
      )}
    </>
  );
};
