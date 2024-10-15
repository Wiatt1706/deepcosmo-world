import { useEffect, useState, useRef } from "react";
import { SkeletonLoader } from "@/components/utils/SkeletonLoader";
import { TbArrowLeft, TbCheck, TbDotsVertical, TbLock } from "react-icons/tb";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Textarea,
} from "@nextui-org/react";
import { useShowBaseStore } from "@/components/map/layout/ShowMapIndex";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { PixelBlock } from "@/types/MapTypes";
import { PixelBoxItem } from "../PixelBoxItem";
import { useNotification } from "@/components/utils/NotificationBar";
import ListILinkAddBtn from "../ListILinkAddBtn";
import { SearchBox } from "../SearchBox";
import { useUserCustomItemBlock } from "@/components/hook/service/useUserCustomItemBlock";
import styles from "@/styles/canvas/ViewLeftTool.module.css";

export default function EditBookmarkView() {
  const supabase = createClientComponentClient();
  const addNotification = useNotification(
    (state: any) => state.addNotification
  );

  const [
    setIsLeftAct,
    selectedListObj,
    setSelectedModule,
    selectedPixelBlock,
    setSelectedPixelBlock,
    userCustomList,
    setUserCustomList,
  ] = useShowBaseStore((state: any) => [
    state.setIsLeftAct,
    state.selectedListObj,
    state.setSelectedModule,
    state.selectedPixelBlock,
    state.setSelectedPixelBlock,
    state.userCustomList,
    state.setUserCustomList,
  ]);

  const { pixelBlocks, loading, error } = useUserCustomItemBlock({
    column: "user_custom_list_id",
    value: selectedListObj.id,
  });

  const [isLoading, setIsLoading] = useState(false); // State for overall save loading
  const [listName, setListName] = useState(selectedListObj.name || "");
  const [listDescribe, setListDescribe] = useState(
    selectedListObj.describe || ""
  );
  const [showPixelBlocks, setShowPixelBlocks] = useState<PixelBlock[] | null>(
    null
  );
  const [deletingPixelBlockId, setDeletingPixelBlockId] = useState<
    string | null
  >(null); // State for tracking the deleting pixel block

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const initialListName = useRef(listName);
  const initialListDescribe = useRef(listDescribe);

  useEffect(() => {
    if (pixelBlocks) {
      setShowPixelBlocks(pixelBlocks);
    }
  }, [pixelBlocks]);

  useEffect(() => {
    if (
      listName === initialListName.current &&
      listDescribe === initialListDescribe.current
    ) {
      return;
    }

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(async () => {
      setIsLoading(true);
      const { error } = await supabase
        .from("UserCustomList")
        .update({
          name: listName,
          describe: listDescribe,
        })
        .eq("id", selectedListObj.id);

      if (error) {
        addNotification(error, "error", "保存异常");
      } else {
        setUserCustomList(
          userCustomList.map((item: any) => {
            if (item.id === selectedListObj.id) {
              return {
                ...item,
                name: listName,
                describe: listDescribe,
              };
            }
            return item;
          })
        );
      }
      setIsLoading(false);
    }, 2000);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [listName, listDescribe]);

  const deletePixelBlock = async (land_id: string) => {
    setDeletingPixelBlockId(land_id); // Set the pixel block being deleted
    const { error } = await supabase
      .from("UserCustomItem")
      .delete()
      .eq("user_custom_list_id", selectedListObj.id)
      .eq("land_id", land_id);

    if (!error && showPixelBlocks) {
      setShowPixelBlocks(
        showPixelBlocks?.filter((item: PixelBlock) => item.id !== land_id)
      );
      addNotification("删除成功", "success", "删除成功");
    } else {
      addNotification("删除失败", "error", "删除异常");
    }

    setDeletingPixelBlockId(null); // Reset after deletion is complete
  };

  return (
    <div className={styles["columnGgroup"]}>
      <SearchBox
        defaultValue={listName}
        startContent={
          <div
            onClick={() => setSelectedModule("Bookmark")}
            className="p-2 hover:text-blue-500 cursor-pointer"
          >
            <TbArrowLeft size={22} strokeWidth={2.3} />
          </div>
        }
        setIsAct={setIsLeftAct}
      />
      <h2 className="flex items-center px-6">修改列表</h2>
      <div className="mb-2 px-6 flex items-center text-[12px] text-gray-500">
        <TbLock />
        <span className="ml-1">不公开</span>
      </div>
      <hr />
      <div
        className="overflow-y-auto"
        style={{ maxHeight: `calc(100vh - 190px)` }}
      >
        {selectedListObj.type === 2 && (
          <div className="p-6">
            <div className="d_c_b text-gray-500 text-[12px] mb-1 px-1">
              <span>列表名称</span>
              <span>0/40</span>
            </div>
            <Input
              variant="bordered"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              radius="none"
              placeholder="请输入列表名称"
              labelPlacement="outside"
            />

            <div className="d_c_b text-gray-500 text-[12px] mb-1 px-1 mt-6">
              <span>列表说明</span>
              <span>0/400</span>
            </div>
            <Textarea
              variant="bordered"
              value={listDescribe}
              onChange={(e) => setListDescribe(e.target.value)}
              labelPlacement="outside"
              radius="none"
              classNames={{
                input: "resize-y max-h-[68px] h-[68px] w-full ",
              }}
            />
          </div>
        )}

        <hr />
        <div className="d_c_b text-gray-500 text-[12px] m-2 px-1">
          <span>像素块</span>
          <ListILinkAddBtn />
        </div>
        {loading && <SkeletonLoader count={3} />}
        {showPixelBlocks?.map((item: PixelBlock) => {
          const key = item.id;
          const isDeleting = deletingPixelBlockId === item.id; // Check if this block is being deleted

          return (
            <PixelBoxItem
              key={key}
              item={item}
              selected={selectedPixelBlock?.id === key}
              hovered={true}
              onClick={() => setSelectedPixelBlock(item)}
              endContent={
                isDeleting ? (
                  <Button isLoading size="sm" />
                ) : (
                  <Dropdown radius="sm">
                    <DropdownTrigger>
                      <button className="flex items-center justify-center w-[42px] h-[42px] rounded-full hover:bg-[#e8ebeb] focus:outline-none">
                        <TbDotsVertical />
                      </button>
                    </DropdownTrigger>
                    <DropdownMenu
                      onAction={(key) => {
                        if (key === "delete") {
                          deletePixelBlock(item.id);
                        }
                      }}
                      aria-label="Static Actions"
                      variant="faded"
                    >
                      <DropdownItem key="share">分享列表</DropdownItem>
                      <DropdownItem
                        key="delete"
                        className="text-danger"
                        color="danger"
                      >
                        删除列表
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                )
              }
            />
          );
        })}
      </div>
      <div className="flex items-center h-[58px] px-6 border-t absolute bottom-0 w-full">
        {!isLoading && (
          <button className="flex items-center justify-center w-[30px] h-[30px] rounded-full bg-[#e8ebeb]">
            <TbCheck />
          </button>
        )}
        <div className="text-xs ml-4">
          <b>自动保存修改内容</b>
          <p className="text-gray-500">更改将自动保存</p>
        </div>
        {isLoading && (
          <div className="absolute top-0 left-0 w-full h-full bg-[#00000030] d_c_c">
            <Button isLoading color="primary" variant="light" />
          </div>
        )}
      </div>
    </div>
  );
}
