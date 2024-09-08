import React, { useEffect, useState } from "react";
import {
  TbCategoryPlus,
  TbGeometry,
  TbUpload,
  TbArrowLeft,
} from "react-icons/tb";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import ModelUpload from "./toolModel/Model_Upload";

export default function ModelTool() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [model, setModel] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) setModel(null);
  }, [isOpen]);
  const GenerateModel = () => (
    <div className="p-4">
      <h3 className="text-lg font-semibold">生成地形土块模块</h3>
      <p className="text-sm text-gray-600">
        这里是生成地形土块的详细描述或操作。
      </p>
    </div>
  );

  const renderContent = (onClose: () => void) => {
    switch (model) {
      case "uploadModel":
        return <ModelUpload onClose={onClose} />;
      case "generateModel":
        return <GenerateModel />;
      default:
        return (
          <div className="flex flex-wrap justify-between gap-4 w-full mb-4">
            <div
              onClick={() => setModel("uploadModel")}
              className="flex flex-1 items-center gap-2 bg-[#f3f6f8] hover:bg-[#d9d9d9] cursor-pointer rounded p-2 min-w-[calc(50%-8px)]"
            >
              <div className="rounded-full p-4 flex items-center justify-center">
                <TbUpload size={24} color="#009ccf" />
              </div>
              <div className="flex flex-col pr-2 py-1">
                <span className="text-sm font-semibold text-gray-700">
                  导入Excel
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  满足规定格式的数据可直接导入
                </span>
              </div>
            </div>
            <div
              onClick={() => setModel("generateModel")}
              className="flex flex-1 items-center gap-2 bg-[#f3f6f8] hover:bg-[#d9d9d9] cursor-pointer rounded p-2 min-w-[calc(50%-8px)]"
            >
              <div className="rounded-full p-4 flex items-center justify-center">
                <TbCategoryPlus size={24} color="#009ccf" />
              </div>
              <div className="flex flex-col pr-2 py-1">
                <span className="text-sm font-semibold text-gray-700">
                  生成地形土块
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  平行四分算法生成的地形土块
                </span>
              </div>
            </div>
          </div>
        );
    }
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
                {/* 返回按钮，点击时返回选择界面 */}
                {model && model !== "" && (
                  <TbArrowLeft
                    size={24}
                    className="cursor-pointer text-gray-600"
                    onClick={() => setModel(null)} // 点击返回到选择界面
                  />
                )}
                <span className="text-lg font-semibold">
                  {model
                    ? model === "uploadModel"
                      ? "导入 Excel"
                      : "生成地形土块"
                    : "扩展工具"}
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
