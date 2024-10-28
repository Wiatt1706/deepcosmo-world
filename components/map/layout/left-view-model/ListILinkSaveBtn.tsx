"use client";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { TbHeart, TbList, TbPlus, TbStar } from "react-icons/tb";
import { ListAddInput } from "./ListAddBtn";
import { useAtomValue } from "jotai";
import { userCustomListAtom } from "../../store/ShowBaseAtomStore";

export default function CustomListSaveWrapper({
  children,
  onListClick,
}: {
  children: React.ReactNode;
  onListClick: (listObj: any) => void;
}) {
  const userCustomList = useAtomValue(userCustomListAtom);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // Process and ensure default lists exist (Star and Like)
  const processedLists = () => {
    const customLists = userCustomList || [];
    const hasStar = customLists.some((item: any) => item.type === 0);
    const hasLike = customLists.some((item: any) => item.type === 1);

    if (!hasStar) {
      customLists.push({
        id: "Star",
        describe: "默认收藏",
        name: "收藏",
        status: 0,
        type: 0,
        sort: 0,
      });
    }

    if (!hasLike) {
      customLists.push({
        id: "Like",
        describe: "默认喜欢",
        name: "喜欢",
        status: 0,
        type: 1,
        sort: 0,
      });
    }

    customLists.sort((a: any, b: any) => {
      if (a.type !== b.type) {
        return a.type - b.type;
      } else {
        return b.sort - a.sort;
      }
    });

    return customLists.map((list: any) => {
      let subLabel = `${list.status === 0 ? "不公开" : "公开"} · ${0} 个像素块`;
      let icon;

      switch (list.type) {
        case 0:
          icon = <TbStar size={20} color="#b06000" className="mx-1" />;
          break;
        case 1:
          icon = <TbHeart size={20} color="#fa507d" className="mx-1" />;
          break;
        default:
          icon = <TbList size={20} color="#606060" className="mx-1" />;
      }

      return {
        key: list.id,
        label: list.name,
        type: list.type,
        subLabel,
        textValue: list.name,
        icon,
      };
    });
  };

  return (
    <>
      <Dropdown
        showArrow
        radius="sm"
        classNames={{
          base: "before:bg-default-200", // change arrow background
          content: "p-0 border-small border-divider bg-background",
        }}
      >
        <DropdownTrigger>{children}</DropdownTrigger>
        <DropdownMenu
          disabledKeys={["title"]}
          aria-label="Static Actions"
          itemClasses={{
            base: [
              "rounded-md",
              "text-default-500",
              "transition-opacity",
              "data-[hover=true]:text-foreground",
              "data-[hover=true]:bg-default-100",
              "dark:data-[hover=true]:bg-default-50",
              "data-[selectable=true]:focus:bg-default-50",
              "data-[pressed=true]:opacity-70",
              "data-[focus-visible=true]:ring-default-500",
            ],
          }}
        >
          <DropdownItem
            isReadOnly
            key="title"
            className="h-10 gap-2 text-[14px] text-[#272727] text-center justify-center items-center"
          >
            保存到您的列表中
          </DropdownItem>

          <DropdownSection
            className="max-h-[300px] overflow-auto"
            aria-label="Profile & Actions"
            showDivider
          >
            {processedLists().map((item: any) => (
              <DropdownItem
                onClick={() => onListClick(item)}
                key={item.key}
                startContent={item.icon}
              >
                {item.textValue}
              </DropdownItem>
            ))}
          </DropdownSection>
          <DropdownItem
            key={"add"}
            onClick={onOpen}
            startContent={
              <TbPlus
                size={20}
                color="#0070f0"
                strokeWidth={1.5}
                className="mx-1"
              />
            }
          >
            新建列表
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

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
    </>
  );
}
