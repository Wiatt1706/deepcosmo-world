"use client";
import {
  Button,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { TbShare } from "react-icons/tb";
import { IconButton } from "./View_LeftInfo";

export default function ShareBtn({ children, pixelBlock }: any) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const copyToClipboard = () => {
    const link = `https://www.deepcosmo.com/map/${pixelBlock.id}`;
    navigator.clipboard
      .writeText(link)
      .then(() => {
        alert("链接已复制到剪贴板！");
      })
      .catch((err) => {
        console.error("复制链接失败:", err);
      });
  };

  return (
    <div>
      <div onClick={onOpen}>{children}</div>

      {/* 模态框内容 */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">分享</ModalHeader>
              <div className="w-full border-b flex items-center px-2">
                <div className="cursor-pointer text-[14px] border-b-3 border-[#1a73e8] mx-4 h-full pb-2">
                  发送链接
                </div>
              </div>
              <div className="flex items-center text-[14px] p-4 gap-2 ">
                <div className="min-w-[64px] min-h-[64px] max-w-[64px] max-h-[64px] border border hover:border-[#006fef] p-1 m-1 overflow-hidden">
                  <Image
                    width={64}
                    height={64}
                    alt="Pixel block Image"
                    src={pixelBlock.landCoverImg || "/images/DefPixel.png"}
                    className="object-cover rounded-sm"
                  />
                </div>
                <div className="flex flex-col px-2 gap-1">
                  <p>{pixelBlock.name}</p>
                  <p className="text-[#70757a] text-xs">
                    {`#${`${pixelBlock.x}, ${pixelBlock.y}`}`}
                  </p>
                </div>
              </div>

              <span className="text-xs text-gray-500 px-6 my-2">分享链接</span>

              <div className="px-6 flex items-end gap-3 pb-4">
                <div className="border-b border-[#70757a] text-[12px] py-1 truncate">
                  {`https://www.deepcosmo.com/map/${pixelBlock.id}`}
                </div>
                <Button
                  size="sm"
                  variant="light"
                  color="primary"
                  onClick={copyToClipboard}
                >
                  复制链接
                </Button>
              </div>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
