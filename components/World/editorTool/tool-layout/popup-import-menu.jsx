"use client";
import React, { useRef, useState } from "react";
import { useToolStore, useMyStore } from "@/components/SocketManager";
import { ImportModelSvg } from "@/components/utils/icons";
import { Button, ButtonGroup } from "@nextui-org/button";
import ImportInput from "@/components/utils/ImportInput";
import ModelViewerWithControls from "@/components/utils/ModelViewerWithControls";
import { HiTrash } from "react-icons/hi2";
import { uuid } from "uuidv4";

export const ImportMenu = () => {
  const importInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [modelList, setModelList] = useMyStore((state) => [
    state.modelList,
    state.setModelList,
  ]);
  const setOpenPopup = useToolStore((state) => state.setOpenPopup);

  const handleFileSelect = (selectedFiles) => {
    setSelectedFile(selectedFiles[0]); // 假设仅支持单文件选择
  };

  const handleFileInputClick = () => {
    importInputRef.current.clickFileInput();
  };

  const handleImport = () => {
    const newItem = {
      text: selectedFile.name,
      type: "ImportGeometry",
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      model_url: URL.createObjectURL(selectedFile),
    };
    
    // 检查 modelList 中是否已存在具有相同文本的项目
    const isDuplicate = modelList.some((model) => model.text === newItem.text);

    if (isDuplicate) {
      // 如果存在重复项，则进行处理，这里假设您希望在文本后面添加一个唯一的序号
      let index = 1;
      let uniqueText = newItem.text + ` (${index})`;
      while (modelList.some((model) => model.text === uniqueText)) {
        index++;
        uniqueText = newItem.text + ` (${index})`;
      }
      newItem.text = uniqueText;
    }
    setModelList([
      ...(modelList ?? []),
      { ...newItem, isSelect: true, id: uuid() },
    ]);
    setOpenPopup(false);
  };

  return (
    <div>
      {selectedFile ? (
        <div className="w-full h-[330px]">
          <ModelViewerWithControls glbUrl={URL.createObjectURL(selectedFile)} />
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
