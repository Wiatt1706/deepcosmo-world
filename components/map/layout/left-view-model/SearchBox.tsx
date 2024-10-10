"use client";
import styles from "@/styles/canvas/ViewLeftTool.module.css";
import { Listbox, ListboxItem } from "@nextui-org/react";
import { ReactNode, useEffect, useRef, useState } from "react";
import { TbMapPin, TbSearch, TbX } from "react-icons/tb";

export const SearchBox = ({
  startContent,
  defaultValue,
  setIsAct,
}: {
  startContent?: ReactNode;
  defaultValue?: string;
  setIsAct: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const toolbarRef = useRef(null);

  const [showToolbar, setShowToolbar] = useState(false);
  const [searchValue, setSearchValue] = useState(defaultValue || "");

  useEffect(() => {
    // 当 searchValue 非空时，才显示 toolbar
    if (searchValue && searchValue !== defaultValue) {
      setShowToolbar(true);
    } else {
      setShowToolbar(false);
    }
  }, [searchValue, defaultValue]);

  return (
    <div className="relative p-4 w-full h-[80px] z-50">
      <div
        className={`${
          showToolbar ? "rounded-t-lg shadow-lg" : "rounded-full"
        } w-full border border-gray-300 flex items-center text-gray-500 px-3 py-2 transition-all duration-300 ease-in-out`}
      >
        {startContent && startContent}
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="搜索历史记录"
          className="w-full text-sm focus:outline-none pl-2"
        />
        <div className="flex space-x-2">
          <div className="p-2 hover:text-blue-500 cursor-pointer">
            <TbSearch size={21} strokeWidth={2.3} />
          </div>
          <div
            onClick={() => setIsAct(false)}
            className="p-2 hover:text-blue-500 cursor-pointer"
          >
            <TbX size={21} strokeWidth={2.3} />
          </div>
        </div>
      </div>

      {showToolbar && (
        <div
          ref={toolbarRef}
          className="w-full border border-t-0 border-gray-300 rounded-b-lg bg-white overflow-y-auto max-h-[300px] transition-all duration-300 ease-in-out shadow-lg"
        >
          <Listbox
            variant="flat"
            aria-label="Listbox menu with sections"
            className="w-full max-h-[300px] overflow-y-auto"
          >
            <ListboxItem key={"test"} startContent={<TbMapPin size={16} />}>
              测试
            </ListboxItem>
          </Listbox>
          <div className="px-4 py-2 text-gray-500 text-sm">搜索记录</div>
        </div>
      )}
    </div>
  );
};
