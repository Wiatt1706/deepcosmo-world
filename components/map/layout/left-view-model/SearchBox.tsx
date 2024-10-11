"use client";
import { Listbox, ListboxItem } from "@nextui-org/react";
import { ReactNode, useEffect, useRef, useState } from "react";
import { TbBookmark, TbMapPin, TbSearch, TbX } from "react-icons/tb";
import { useShowBaseStore } from "../ShowMapIndex";

export const SearchBox = ({
  startContent,
  defaultValue,
  setIsAct,
}: {
  startContent?: ReactNode;
  defaultValue?: string;
  setIsAct: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [searchValue, setSearchValue] = useState(defaultValue || "");
  const [isFocused, setIsFocused] = useState(false);
  const [page, setPage] = useState(1); // 当前页码
  const [loading, setLoading] = useState(false); // 是否正在加载新数据
  const resultsPerPage = 10; // 每页展示多少条结果

  const [
    userCustomList,
    loadData,
    setSelectedModule,
    setSelectedListObj,
    setSelectedPixelBlock,
  ] = useShowBaseStore((state: any) => [
    state.userCustomList,
    state.loadData,
    state.setSelectedModule,
    state.setSelectedListObj,
    state.setSelectedPixelBlock,
  ]);

  const [filteredResults, setFilteredResults] = useState<
    Array<{ name: string; source: "custom" | "load"; obj: any }>
  >([]);
  const [displayedResults, setDisplayedResults] = useState<
    Array<{ name: string; source: "custom" | "load"; obj: any }>
  >([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchValue) {
      const customMatches = userCustomList
        .filter((item: any) => item.name.includes(searchValue))
        .map((item: any) => ({ name: item.name, source: "custom", obj: item }));

      const loadMatches = loadData
        .filter((item: any) => item.name.includes(searchValue))
        .map((item: any) => ({ name: item.name, source: "load", obj: item }));

      setFilteredResults([...customMatches, ...loadMatches]);
      setDisplayedResults([
        ...customMatches.slice(0, resultsPerPage),
        ...loadMatches.slice(0, resultsPerPage),
      ]);
    } else {
      setFilteredResults([]);
      setDisplayedResults([]);
    }
  }, [searchValue, userCustomList, loadData]);

  // 检查是否滚动到底部，并加载更多数据
  useEffect(() => {
    const handleScroll = () => {
      if (boxRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = boxRef.current;
        if (
          scrollTop + clientHeight >= scrollHeight - 50 &&
          !loading &&
          displayedResults.length < filteredResults.length
        ) {
          setLoading(true);
          // 模拟加载更多数据
          setTimeout(() => {
            const nextResults = filteredResults.slice(
              displayedResults.length,
              displayedResults.length + resultsPerPage
            );
            setDisplayedResults([...displayedResults, ...nextResults]);
            setLoading(false);
            setPage(page + 1);
          }, 500); // 模拟网络请求的延迟
        }
      }
    };

    if (isFocused) {
      boxRef.current?.addEventListener("scroll", handleScroll);
    } else {
      boxRef.current?.removeEventListener("scroll", handleScroll);
    }

    return () => {
      boxRef.current?.removeEventListener("scroll", handleScroll);
    };
  }, [isFocused, displayedResults, filteredResults, loading, page]);

  // 检测点击外部区域关闭下拉框
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(e.target as Node) &&
        boxRef.current &&
        !boxRef.current.contains(e.target as Node)
      ) {
        setIsFocused(false);
      }
    };
    if (isFocused) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFocused]);

  const showToolbar = isFocused && displayedResults.length > 0;

  return (
    <div className="relative p-4 w-full h-[80px] z-50">
      <div
        className={`${
          showToolbar ? "rounded-t-lg shadow-lg" : "rounded-full"
        } w-full border border-gray-300 flex items-center text-gray-500 px-3 py-2 transition-all duration-300 ease-in-out`}
      >
        {startContent && startContent}
        <input
          ref={inputRef}
          type="text"
          value={searchValue}
          onFocus={() => setIsFocused(true)}
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
          ref={boxRef}
          className="w-full border border-t-0 border-gray-300 rounded-b-lg bg-white transition-all duration-300 ease-in-out shadow-lg max-h-[300px] overflow-y-auto"
        >
          <Listbox
            variant="flat"
            aria-label="Listbox menu with sections"
            className="w-full p-0 gap-0 divide-y divide-default-300/50 bg-content1"
            itemClasses={{
              base: "px-3 rounded-none gap-3 h-12 data-[hover=true]:bg-default-100/80",
            }}
          >
            {displayedResults.map((item, index) => (
              <ListboxItem
                key={index}
                onClick={() => {
                  console.log(item);
                  if (item.source === "custom") {
                    setSelectedModule("ShowBookmark");
                    setSelectedListObj(item.obj);
                  } else if (item.source === "load") {
                    setSelectedPixelBlock(item.obj);
                  }
                  setIsFocused(false);
                  setSearchValue("");
                }}
                startContent={
                  <div className="p-2 text-gray-500">
                    {item.source === "custom" ? (
                      <TbBookmark size={18} />
                    ) : (
                      <TbMapPin size={18} />
                    )}
                  </div>
                }
              >
                {item.name}
              </ListboxItem>
            ))}
          </Listbox>

          {/* 底部加载状态 */}
          {loading && (
            <div className="px-4 py-2 text-gray-500 text-sm text-center">
              加载更多...
            </div>
          )}
        </div>
      )}
    </div>
  );
};
