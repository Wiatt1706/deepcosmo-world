"use client";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { TbPlus } from "react-icons/tb";
import { useState } from "react";
import { useNotification } from "@/components/utils/NotificationBar";

export default function ListILinkAddBtn() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [serachText, setSerachText] = useState(""); // 跟踪输入框的值
  const addNotification = useNotification(
    (state: any) => state.addNotification
  );

  const [isLoading, setIsLoading] = useState(false); // 跟踪加载状态

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSerachText(e.target.value);
  };

  const handleCreateList = async () => {
    if (serachText.trim()) {
      setIsLoading(true); // 开始加载
      console.log("serachText", serachText);

      setIsLoading(false); // 加载完成
    }
  };

  return (
    <div>
      {/* 打开模态框按钮 */}
      <Button
        onClick={onOpen}
        variant="light"
        size="sm"
        startContent={
          <TbPlus
            size={18}
            strokeWidth={3.3}
            className="text-[#0070f0] cursor-pointer"
          />
        }
      >
        <span className="ml-1">添加块</span>
      </Button>

      {/* 模态框内容 */}
      <Modal
        radius="sm"
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
              <ModalHeader className="flex flex-col gap-1">添加块</ModalHeader>
              <ModalBody>
                <Input
                  label="像素块ID"
                  value={serachText}
                  onChange={handleInputChange} // 跟踪输入框变化
                />
              </ModalBody>
              <ModalFooter>
                {/* 仅在有输入时才可点击 */}
                <Button
                  color="primary"
                  variant="light"
                  onPress={handleCreateList}
                  isDisabled={!serachText.trim()} // 如果输入为空，禁用按钮
                  isLoading={isLoading} // 添加加载效果
                >
                  添加
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
