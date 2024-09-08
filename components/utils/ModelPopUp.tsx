import React, { ReactNode } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";

// 定义 Props 接口
interface ModelPopUpProps {
  title: string; // 弹窗标题
  message: string; // 提示语
  onConfirm: () => void; // 确认事件
  triggerContent: ReactNode; // 触发弹窗的内容
}

export default function ModelPopUp({
  title,
  message,
  onConfirm,
  triggerContent,
}: ModelPopUpProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      {/* 触发弹窗的内容，可以自定义 */}
      <div onClick={onOpen} className="cursor-pointer">
        {triggerContent}
      </div>

      {/* 弹窗 */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {title} {/* 显示标题 */}
              </ModalHeader>
              <ModalBody>
                <p>{message}</p> {/* 显示提示语 */}
              </ModalBody>
              <ModalFooter>
                {/* 取消按钮 */}
                <Button color="danger" variant="light" onPress={onClose}>
                  关闭
                </Button>
                {/* 确认按钮 */}
                <Button
                  color="primary"
                  onPress={() => {
                    onConfirm(); // 调用确认事件
                    onClose(); // 关闭弹窗
                  }}
                >
                  确认
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
