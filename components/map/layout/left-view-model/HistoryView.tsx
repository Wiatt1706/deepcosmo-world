"use client";
import styles from "@/styles/canvas/ViewLeftTool.module.css";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Modal,
  ModalContent,
  ScrollShadow,
  useDisclosure,
} from "@nextui-org/react";
import { Key, useState } from "react";
import {
  TbBookmarkFilled,
  TbCheck,
  TbHeart,
  TbInfoCircle,
  TbList,
  TbMapPin,
  TbPlus,
  TbShare,
  TbSquare,
  TbSquareCheckFilled,
  TbStar,
} from "react-icons/tb";
import { PixelBlock } from "@/types/MapTypes";
import { useShowBaseStore } from "@/components/map/layout/ShowMapIndex";
import { PixelBoxItem } from "./PixelBoxItem";
import { SearchBox } from "./SearchBox";
import { ListAddInput } from "./ListAddBtn";
import { post as postApi } from "@/utils/api";
import { useNotification } from "@/components/utils/NotificationBar";

export default function HistoryView({
  setIsAct,
}: {
  setIsAct: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [typeSelectedValue, setTypeSelectedValue] = useState("all"); // 默认选中的值
  const [
    selectedPixelBlock,
    setSelectedPixelBlock,
    lastListPixelBlock,
    userCustomList,
  ] = useShowBaseStore((state: any) => [
    state.selectedPixelBlock,
    state.setSelectedPixelBlock,
    state.lastListPixelBlock,
    state.userCustomList,
  ]);

  const [selectedKeys, setSelectedKeys] = useState<Set<Key>>(new Set());
  const [areAllSelected, setAreAllSelected] = useState(false); // Track if all are selected
  const [hoveredKey, setHoveredKey] = useState<string | null>(null); // Track hovered item
  const [isLoading, setIsLoading] = useState(false); // 跟踪加载状态

  const addNotification = useNotification(
    (state: any) => state.addNotification
  );

  const options = [
    { value: "all", label: "全部", icon: null },
    { value: "netrue", label: "Neture", icon: <TbMapPin /> },
  ];

  const handleSelect = (value: string) => {
    setTypeSelectedValue(value);
  };

  const handleToggleSelectAll = () => {
    if (areAllSelected) {
      setSelectedKeys(new Set()); // Deselect all
    } else {
      const allKeys = Array.from(lastListPixelBlock as Set<PixelBlock>).map(
        (item: PixelBlock) => item.id
      );
      setSelectedKeys(new Set(allKeys)); // Select all
    }
    setAreAllSelected(!areAllSelected); // Toggle the state
  };

  const handleToggleSelection = (key: string) => {
    const newSelectedKeys = new Set(selectedKeys);
    if (newSelectedKeys.has(key)) {
      newSelectedKeys.delete(key); // Deselect if already selected
    } else {
      newSelectedKeys.add(key); // Select if not already selected
    }
    setSelectedKeys(newSelectedKeys); // Update the state
  };

  const handleCreateListLink = async (listObj: any) => {
    if (selectedKeys && selectedKeys.size > 0) {
      const selectedIds = Array.from(selectedKeys);
      setIsLoading(true); // 开始加载
      await postApi(`/userCustomItem`, {
        listId: listObj.key,
        listLinkIds: selectedIds,
      })
        .then((response) => {
          if (response.data) {
            setSelectedKeys(new Set()); // 清空选中项
            setAreAllSelected(false); // 清空全选状态
            addNotification(
              "已保存到" + listObj.textValue + "列表",
              "success",
              "保存成功"
            );
          } else {
            addNotification(
              response.message || "未知异常请稍后重试",
              "error",
              "保存异常"
            );
          }
        })
        .finally(() => {
          setIsLoading(false); // 加载完成
        });
    }
  };

  const isAnySelected = selectedKeys.size > 0;

  return (
    <div className={styles["columnGgroup"]}>
      <SearchBox setIsAct={setIsAct} />
      <h2 className="flex items-center px-6 h-[32px]">
        最近
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent the event from bubbling up
          }}
          className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-[#e8ebeb] focus:outline-none"
        >
          <TbInfoCircle />
        </button>
      </h2>

      <ScrollShadow hideScrollBar orientation="horizontal">
        <div className="flex gap-2 px-6 py-6 h-[80px]">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`flex items-center gap-2 border px-3 py-1 rounded cursor-pointer ${
                typeSelectedValue === option.value
                  ? "border-[#d2e3fc] text-[#1967d2] bg-[#e8f0fe]"
                  : ""
              }`}
            >
              {typeSelectedValue === option.value ? (
                <TbCheck /> // 使用选中状态的图标
              ) : (
                option.icon // 默认图标
              )}
              <span className="text-[14px] whitespace-nowrap">
                {option.label}
              </span>
            </div>
          ))}
        </div>
      </ScrollShadow>

      <hr />

      <div
        className="overflow-y-auto"
        style={{ maxHeight: `calc(100vh - 260px)` }}
      >
        {Array.from(lastListPixelBlock as Set<PixelBlock>).map(
          (item: PixelBlock) => {
            const key = item.id; // Correctly form the key
            const isSelected = selectedKeys.has(key); // Check if selected
            const isHovered = hoveredKey === key; // Check if hovered
            return (
              <PixelBoxItem
                key={key}
                item={item}
                selected={selectedPixelBlock?.id === key}
                hovered={isHovered || isSelected}
                onClick={() => setSelectedPixelBlock(item)}
                onHover={setHoveredKey}
                endContent={
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleSelection(key);
                    }}
                    className="cursor-pointer h-[60px] px-2 d_c_c"
                  >
                    {isSelected ? (
                      <TbSquareCheckFilled color="#006fef" size={20} />
                    ) : (
                      <TbSquare size={20} />
                    )}
                  </div>
                }
              />
            );
          }
        )}
      </div>

      <div className="w-full h-[68px] border-t absolute bottom-0 flex items-center justify-between px-4">
        <div
          className={`d_c_c gap-2 ${
            isAnySelected ? "" : "opacity-50 pointer-events-none"
          }`}
        >
          {userCustomListBoxs({
            isAnySelected: isAnySelected,
            onListClick: handleCreateListLink,
            isLoading: isLoading,
          })}

          <div
            className={`w-[36px] h-[36px] d_c_c border rounded-full text-[#1967d2] ${
              isAnySelected
                ? "hover:bg-[#e8f0fe]"
                : "opacity-50 pointer-events-none"
            }`}
          >
            <TbShare size={16} strokeWidth={1.5} />
          </div>
        </div>
        <Button
          variant="light"
          color="primary"
          size="sm"
          className={`${areAllSelected ? "" : ""} text-[14px]`}
          onClick={handleToggleSelectAll}
        >
          {areAllSelected ? "取消全选" : "全选"}
        </Button>
      </div>
    </div>
  );
}

const userCustomListBoxs = ({
  isAnySelected,
  isLoading,
  onListClick,
}: {
  isAnySelected: boolean;
  isLoading: boolean;
  onListClick: (listObj: any) => void;
}) => {
  const [userCustomList] = useShowBaseStore((state: any) => [
    state.userCustomList,
  ]);
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
        <DropdownTrigger>
          <Button
            isLoading={isLoading}
            radius="full"
            color="primary"
            size="sm"
            startContent={
              !isLoading && <TbBookmarkFilled size={16} strokeWidth={1.5} />
            }
            className="px-4 text-[14px] h-[36px]"
            disabled={!isAnySelected || isLoading} // Disable when no items are selected
          >
            保存
          </Button>
        </DropdownTrigger>
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
};
