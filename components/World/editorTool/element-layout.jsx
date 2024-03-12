"use client";
import { useState, useEffect } from "react";
import style from "./index.css";
import { useElementStore } from "@/components/SocketManager";
import Tree from "@/components/utils/Tree";
import { Chip } from "@nextui-org/react";
import { BiCube } from "react-icons/bi";

function convertObjectToTreeNode(object) {
  const treeData = {
    label: object.type,
    children: [],
  };

  if (object.children && object.children.length > 0) {
    treeData.children = object.children.map((child) =>
      convertObjectToTreeNode(child)
    );
  }

  // Add additional properties based on your requirements
  if (object.type === "Mesh") {
    treeData.startContent = <BiCube size={18} />;
    treeData.isEye = true;
  }

  return treeData;
}

export const ElementView = () => {
  const { isOpen, setOpen, sceneList } = useElementStore();
  const [treeData, setTreeData] = useState([]);
  console.log("sceneList", sceneList);

  useEffect(() => {
    const rootNodes = sceneList.map((child) => convertObjectToTreeNode(child));
    setTreeData(rootNodes);
  }, [sceneList]);

  return (
    <>
      {isOpen && (
        <div className="left-tool">
          <div className="flex flex-col">
            <div className="flex items-center hover:bg-gray-200 w-full">
              <span className="text-sm">
                <Chip startContent={<BiCube size={18} />} variant="light">
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
