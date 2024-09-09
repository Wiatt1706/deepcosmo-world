import React, { useEffect, useState } from "react";
import {
  TbCategoryPlus,
  TbGeometry,
  TbUpload,
  TbArrowLeft,
  TbPhotoStar,
} from "react-icons/tb";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import ModelUpload from "./toolModel/Model_Upload";
import ModelGenerateLand from "./toolModel/Model_GenerateLand";
import ModelImageToLand from "./toolModel/Model_ImageToLand";

interface Tool {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  component: React.FC<{ onClose: () => void }>;
  color: string;
}

export default function ModelTool() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [model, setModel] = useState<string | null>(null);

  // 工具定义：可扩展
  const tools: Tool[] = [
    {
      id: "uploadModel",
      title: "导入Excel",
      description: "满足规定格式的数据可直接导入",
      icon: <TbUpload size={24} />,
      component: ModelUpload,
      color: "#009ccf",
    },
    {
      id: "generateModel",
      title: "生成地形土块",
      description: "算法生成的地形土块，可用像素块越多效果越好",
      icon: <TbCategoryPlus size={24} />,
      component: ModelGenerateLand,
      color: "#0070f0",
    },
    {
      id: "imageToLand",
      title: "图片像素块",
      description: "将图片生成像素块",
      icon: <TbPhotoStar size={24} />,
      component: ModelImageToLand, // Placeholder, can replace with the actual component
      color: "#f5476a",
    },
  ];

  useEffect(() => {
    if (isOpen) setModel(null);
  }, [isOpen]);

  const renderToolButton = (tool: Tool) => (
    <div
      key={tool.id}
      onClick={() => setModel(tool.id)}
      className="flex flex-1 items-center gap-2 bg-[#f3f6f8] hover:bg-[#d9d9d9] cursor-pointer rounded p-2 min-w-[calc(50%-8px)]"
    >
      <div
        className="rounded-full p-4 flex items-center justify-center"
        style={{ color: tool.color }}
      >
        {tool.icon}
      </div>
      <div className="flex flex-col pr-2 py-1">
        <span className="text-sm font-semibold text-gray-700">
          {tool.title}
        </span>
        <span className="text-xs text-gray-500 mt-1">{tool.description}</span>
      </div>
    </div>
  );

  const renderContent = (onClose: () => void) => {
    if (!model) {
      // 工具选择界面
      return (
        <div className="flex flex-wrap justify-between gap-4 w-full mb-4">
          {tools.map(renderToolButton)}
        </div>
      );
    }
    // 工具内容界面
    const selectedTool = tools.find((tool) => tool.id === model);
    if (selectedTool && selectedTool.component) {
      const ToolComponent = selectedTool.component;
      return <ToolComponent onClose={onClose} />;
    }
    return null;
  };

  const getHeaderTitle = () => {
    if (!model) return "扩展工具";
    const selectedTool = tools.find((tool) => tool.id === model);
    return selectedTool ? selectedTool.title : "扩展工具";
  };

  return (
    <>
      <div
        onClick={onOpen}
        className="flex items-center justify-center w-[38px] h-[38px] rounded-full hover:bg-[#f3f6f8] text-[#4c5863]"
      >
        <TbGeometry size={24} strokeWidth={1.1} />
      </div>

      <Modal
        radius="sm"
        size="lg"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
        classNames={{
          backdrop: "backdrop-blur-lg bg-opacity-80 bg-[#010E18]",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center gap-2">
                {model && (
                  <TbArrowLeft
                    size={24}
                    className="cursor-pointer text-gray-600"
                    onClick={() => setModel(null)} // 返回到工具选择界面
                  />
                )}
                <span className="text-lg font-semibold">
                  {getHeaderTitle()}
                </span>
              </ModalHeader>
              <ModalBody>{renderContent(onClose)}</ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
