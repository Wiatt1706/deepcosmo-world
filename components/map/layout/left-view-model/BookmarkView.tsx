"use client";
import styles from "@/styles/canvas/ViewLeftTool.module.css";
import { SearchBox } from "./HistoryView";
import { Button, Listbox, ListboxItem, Tab, Tabs } from "@nextui-org/react";
import { TbDotsVertical, TbHeart, TbPlus, TbStar } from "react-icons/tb";

interface Item {
  key: string;
  label: string;
  subLabel: string;
  textValue: string;
  icon?: any;
}

const ListBoxs = ({ items }: { items: Item[] }) => {
  return (
    <Listbox
      aria-label="User Menu"
      className="p-0 gap-0 divide-y divide-default-300/50 dark:divide-default-100/80 bg-content1 overflow-visible "
      itemClasses={{
        base: "px-3 rounded-none gap-3 data-[hover=true]:bg-default-100/80",
      }}
    >
      {items.map((item) => (
        <ListboxItem
          onClick={(e) => alert(item.key + " aborted")}
          key={item.key}
          endContent={
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent the event from bubbling up
                alert(item.key + " clicked");
              }}
              className="flex items-center justify-center w-[42px] h-[42px] rounded-full hover:bg-[#e8ebeb] focus:outline-none"
            >
              <TbDotsVertical />
            </button>
          }
          startContent={item.icon}
          textValue={item.textValue}
          className="relative hover:bg-default-100/80 transition"
        >
          <div className="flex flex-col gap-1 py-2">
            <span className="font-semibold">{item.label}</span>
            <span className="text-tiny text-default-600">{item.subLabel}</span>
          </div>
        </ListboxItem>
      ))}
    </Listbox>
  );
};

export default function BookmarkView({
  setIsAct,
}: {
  setIsAct: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const items: Item[] = [
    {
      key: "Star",
      label: "收藏",
      subLabel: "不公开·3个像素块",
      textValue: "Star",
      icon: <TbStar size={20} color="#b06000" className="mx-2" />,
    },
    {
      key: "Like",
      label: "喜欢",
      subLabel: "不公开·0个像素块",
      textValue: "Like",
      icon: <TbHeart size={20} color="#fa507d" className="mx-2" />,
    },

    // 可以添加更多项目
  ];

  return (
    <div className={styles["columnGgroup"]}>
      <SearchBox setIsAct={setIsAct} />

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
              <Button
                size="sm"
                color="primary"
                variant="light"
                startContent={<TbPlus />}
              >
                <span className="text-[14px]">新建列表</span>
              </Button>
            </div>
            <ListBoxs items={items} />
          </div>
        </Tab>
        <Tab key="Templates" title="收藏" className="p-0">
          <div
            className="w-full overflow-auto pt-2 text-left"
            style={{ maxHeight: `calc(100vh - 131px)` }}
          ></div>
        </Tab>
        <Tab key="Geometry" title="喜欢" className="p-0">
          <div
            className="w-full overflow-auto pt-2 text-left"
            style={{ maxHeight: `calc(100vh - 131px)` }}
          ></div>
        </Tab>
      </Tabs>
    </div>
  );
}
