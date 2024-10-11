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
import { post as postApi } from "@/utils/api";
import { useNotification } from "@/components/utils/NotificationBar";
import { useShowBaseStore } from "../ShowMapIndex";

export default function ListAddBtn() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div>
      {/* 打开模态框按钮 */}
      <Button
        onClick={onOpen}
        size="sm"
        color="primary"
        variant="light"
        startContent={<TbPlus />}
      >
        <span className="text-[14px]">新建列表</span>
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
          {(onClose) => <>{ListAddInput({ onOpenChange })}</>}
        </ModalContent>
      </Modal>
    </div>
  );
}

export function ListAddInput({ onOpenChange }: any) {
  const [listName, setListName] = useState(""); // 跟踪输入框的值
  const addNotification = useNotification(
    (state: any) => state.addNotification
  );
  const [userCustomList, setUserCustomList] = useShowBaseStore((state: any) => [
    state.userCustomList,
    state.setUserCustomList,
  ]);
  const [isLoading, setIsLoading] = useState(false); // 跟踪加载状态

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setListName(e.target.value);
  };

  const handleCreateList = async () => {
    if (listName.trim()) {
      setIsLoading(true); // 开始加载
      await postApi(`/userCustomList`, {
        name: listName,
        type: 2,
        sort: userCustomList.length,
      })
        .then((response) => {
          console.log("response", response.data);

          if (response.data) {
            setListName(""); // 清空输入框
            onOpenChange(); // 关闭模态框
            setUserCustomList([...userCustomList, response.data]);
          } else {
            addNotification("创建列表失败", "error", "保存异常");
          }
        })
        .finally(() => {
          setIsLoading(false); // 加载完成
        });
    }
  };

  return (
    <div>
      <>
        <ModalHeader className="flex flex-col gap-1">新建列表</ModalHeader>
        <ModalBody>
          {/* 输入框 */}
          <Input
            label="列表名称"
            value={listName}
            onChange={handleInputChange} // 跟踪输入框变化
            placeholder="请输入列表名称"
          />
        </ModalBody>
        <ModalFooter>
          {/* 仅在有输入时才可点击 */}
          <Button
            color="primary"
            variant="light"
            onPress={handleCreateList}
            isDisabled={!listName.trim()} // 如果输入为空，禁用按钮
            isLoading={isLoading} // 添加加载效果
          >
            制作
          </Button>
        </ModalFooter>
      </>
    </div>
  );
}
