"use client";
import React, { useRef, useState } from "react";
import {
  useToolStore,
  useMyStore,
  useElementStore,
} from "@/components/SocketManager";
import { ImportModelSvg } from "@/components/utils/icons";
import { Button, ButtonGroup } from "@nextui-org/button";
import ImportInput from "@/components/utils/ImportInput";
import ModelViewerWithControls from "@/components/utils/ModelViewerWithControls";
import { HiTrash } from "react-icons/hi2";
import { useNotification } from "@/components/utils/NotificationBar";

export const ImportMenu = () => {
  const importInputRef = useRef(null);
  let modelData;
  let nodeList = [];
  const [selectedFile, setSelectedFile] = useState(null);
  const [modelList, setModelList] = useMyStore((state) => [
    state.modelList,
    state.setModelList,
  ]);
  const [nodes, setNodes] = useElementStore((state) => [
    state.nodes,
    state.setNodes,
  ]);
  const setOpenPopup = useToolStore((state) => state.setOpenPopup);
  const addNotification = useNotification((state) => state.addNotification);

  const handleFileSelect = (selectedFiles) => {
    setSelectedFile(selectedFiles[0]); // 假设仅支持单文件选择
  };

  const handleFileInputClick = () => {
    importInputRef.current.clickFileInput();
  };

  const handleModelLoad = (data, newNodes) => {
    if (!data) {
      setSelectedFile(null);
      addNotification(
        "Failed to load model file, please check your model file format",
        "error",
        "Model Load Error"
      );
      return;
    }
    modelData = data;

    const mergedNodes = { ...nodes };

    Object.keys(newNodes).forEach((nodeName) => {
      // 如果现有的节点中不包含新节点的名称，则将新节点添加到 mergedNodes 中
      if (!mergedNodes[nodeName]) {
        mergedNodes[nodeName] = newNodes[nodeName];
      }
    });
    nodeList = mergedNodes;
    // 更新节点状态
  };

  const handleImport = () => {
    modelData.name = selectedFile.name.split(".")[0];
    // 将唯一的节点累加到 nodes 中
    setNodes(nodeList);
    setModelList([...(modelList ?? []), { ...modelData, isSelect: true }]);
    setOpenPopup(false);
  };

  return (
    <div>
      {selectedFile ? (
        <div className="w-full h-[330px]">
          <ModelViewerWithControls
            glbUrl={URL.createObjectURL(selectedFile)}
            onModelLoad={handleModelLoad}
          />
        </div>
      ) : (
        <div
          onClick={handleFileInputClick}
          className="bottom-tool-box h-[325px] text-default-400 flex flex-col items-center cursor-pointer"
        >
          <ImportModelSvg width={60} height={60} />
          <span className="text-default-300 pt-2">仅支持.glb .gltf格式</span>
        </div>
      )}

      <ImportInput
        ref={importInputRef}
        handleSelect={handleFileSelect}
        accept=".glb,.gltf"
      />
      <div className="w-full absolute bottom-0 p-2">
        <ButtonGroup className="w-full">
          <Button
            onClick={() => setSelectedFile(null)}
            isIconOnly
            isDisabled={!selectedFile}
            variant="ghost"
            color="primary"
          >
            <HiTrash />
          </Button>
          <Button
            isDisabled={!selectedFile}
            className="w-full"
            color="primary"
            icon={<ImportModelSvg />}
            onClick={handleImport}
          >
            导入
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
};
