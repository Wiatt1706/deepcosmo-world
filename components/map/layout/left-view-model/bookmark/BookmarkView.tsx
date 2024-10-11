"use client";
import styles from "@/styles/canvas/ViewLeftTool.module.css";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Listbox,
  ListboxItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tab,
  Tabs,
  useDisclosure,
} from "@nextui-org/react";
import { TbDotsVertical, TbHeart, TbList, TbStar } from "react-icons/tb";
import ListAddBtn from "../ListAddBtn";
import { useState } from "react";
import { useShowBaseStore } from "@/components/map/layout/ShowMapIndex";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Session } from "@supabase/auth-helpers-nextjs";
import { useNotification } from "@/components/utils/NotificationBar";
import { SearchBox } from "../SearchBox";
import { ShowBookmarkList } from "./ShowBookmarkView";

const ListBoxs = ({
  userCustomList,
  onDeleteConfirm,
}: {
  userCustomList: any[];
  onDeleteConfirm: (id: string) => void;
}) => {
  const [setSelectedModule, setSelectedListObj] = useShowBaseStore(
    (state: any) => [state.setSelectedModule, state.setSelectedListObj]
  );

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectObj, setSelectObj] = useState<any | null>(null); // Track hovered item

  const checkSelectedListHandle = (module: string, id: string) => {
    setSelectedModule(module);
    const selectedList = userCustomList.find((item: any) => item.id === id);
    setSelectedListObj(selectedList);
  };
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

    // Sort lists by sort, and by type if sort is the same
    customLists.sort((a: any, b: any) => {
      if (a.sort !== b.sort) {
        return b.sort - a.sort;
      } else {
        return b.type - a.type;
      }
    });

    // Convert lists to Listbox items
    return customLists.map((list: any) => {
      let subLabel = `${list.status === 0 ? "不公开" : "公开"} · ${0} 个像素块`;
      let icon;

      switch (list.type) {
        case 0:
          icon = <TbStar size={20} color="#b06000" className="mx-2" />;
          break;
        case 1:
          icon = <TbHeart size={20} color="#fa507d" className="mx-2" />;
          break;
        default:
          icon = <TbList size={20} color="#606060" className="mx-2" />;
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
      <Listbox
        aria-label="User Menu"
        onAction={(key) =>
          checkSelectedListHandle("ShowBookmark", key.toString())
        }
        className="p-0 gap-0 divide-y divide-default-300/50 dark:divide-default-100/80 bg-content1 overflow-visible "
        itemClasses={{
          base: "px-3 rounded-none gap-3 data-[hover=true]:bg-default-100/80",
        }}
      >
        {processedLists().map((item) => (
          <ListboxItem
            key={item.key}
            endContent={
              <Dropdown radius="sm">
                <DropdownTrigger>
                  <button className="flex items-center justify-center w-[42px] h-[42px] rounded-full hover:bg-[#e8ebeb] focus:outline-none">
                    <TbDotsVertical />
                  </button>
                </DropdownTrigger>
                <DropdownMenu
                  disabledKeys={
                    item.type === 0 || item.type === 1 ? ["delete"] : []
                  }
                  aria-label="Static Actions"
                  variant="faded"
                >
                  <DropdownItem
                    onClick={(e) =>
                      checkSelectedListHandle("EditBookmark", item.key)
                    }
                    key="update"
                  >
                    修改列表
                  </DropdownItem>
                  <DropdownItem key="share">分享列表</DropdownItem>
                  <DropdownItem
                    key="delete"
                    onClick={(e) => {
                      if (item.type !== 0 && item.type !== 1) {
                        // 排除收藏 (type = 0) 和 喜欢 (type = 1)
                        setSelectObj(item);
                        onOpen();
                      }
                    }}
                    className="text-danger"
                    color="danger"
                  >
                    删除列表
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            }
            startContent={item.icon}
            textValue={item.textValue}
            className="relative hover:bg-default-100/80 transition"
          >
            <div className="flex flex-col gap-1 py-2">
              <span className="font-semibold">{item.label}</span>
              <span className="text-tiny text-default-600">
                {item.subLabel}
              </span>
            </div>
          </ListboxItem>
        ))}
      </Listbox>

      <Modal size="xs" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                删除列表
              </ModalHeader>
              <ModalBody>
                删除此列表将会清除此列表中的所有块,是否要删除？
              </ModalBody>
              <ModalFooter>
                {/* 取消按钮 */}
                <Button
                  size="sm"
                  color="danger"
                  variant="light"
                  onPress={onClose}
                >
                  关闭
                </Button>
                {/* 确认按钮 */}
                <Button
                  size="sm"
                  color="primary"
                  onPress={() => {
                    onDeleteConfirm(selectObj.key);
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
};

export default function BookmarkView({
  session,
}: {
  session?: Session | null;
}) {
  const supabase = createClientComponentClient<Database>();
  const addNotification = useNotification(
    (state: any) => state.addNotification
  );
  const [userCustomList, setUserCustomList, setIsLeftAct] = useShowBaseStore(
    (state: any) => [
      state.userCustomList,
      state.setUserCustomList,
      state.setIsLeftAct,
    ]
  );

  const deleteListBtnHandle = async (id: string) => {
    // TODO: 删除
    const { error } = await supabase
      .from("UserCustomList")
      .delete()
      .eq("id", id);

    if (error) {
      console.log(error.message);
      addNotification("删除列表失败, 请重试", "error", "删除异常");
      return;
    }
    setUserCustomList(userCustomList.filter((item: any) => item.id !== id));
  };

  return (
    <div className={styles["columnGgroup"]}>
      <SearchBox setIsAct={setIsLeftAct} />

      <Tabs
        aria-label="Options"
        color="primary"
        variant="underlined"
        classNames={{
          tabList: "gap-6 w-full relative rounded-none p-0",
          cursor: "w-full bg-primary text-white",
          tab: "max-w-fit px-2 h-12",
          base: "w-full px-4 border-b border-divider",
        }}
      >
        <Tab key="All" title="列表" className="p-0">
          <div
            className="w-full overflow-auto pt-2 text-left"
            style={{ maxHeight: `calc(100vh - 131px)` }}
          >
            <div className="d_c_b px-6 py-1 mb-2">
              <h2 className={styles["col-title"]}>您的列表</h2>
              <ListAddBtn />
            </div>
            <ListBoxs
              userCustomList={userCustomList}
              onDeleteConfirm={deleteListBtnHandle}
            />
          </div>
        </Tab>
        <Tab key="Templates" title="收藏" className="p-0">
          <div
            className="w-full overflow-auto pt-2 text-left"
            style={{ maxHeight: `calc(100vh - 131px)` }}
          >
            <ShowBookmarkList
              selectedListId={
                userCustomList.filter((item: any) => item.type == 0)[0].id
              }
            />
          </div>
        </Tab>
        <Tab key="Geometry" title="喜欢" className="p-0">
          <div
            className="w-full overflow-auto pt-2 text-left"
            style={{ maxHeight: `calc(100vh - 131px)` }}
          >
            <ShowBookmarkList
              selectedListId={
                userCustomList.filter((item: any) => item.type == 1)[0].id
              }
            />
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}
