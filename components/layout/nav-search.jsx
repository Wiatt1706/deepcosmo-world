"use client";
import styles from "./nav-search.module.css";
import { Input } from "@nextui-org/input";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { useKeywordStore } from "../products/product-keyword";
import { Listbox, ListboxItem } from "@nextui-org/react";
import { TbHash } from "react-icons/tb";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function SearchNav() {
  const router = useRouter();

  const keywords = useKeywordStore((state) => state.keywords);
  const [searchValue, setSearchValue] = useState("");
  const [showToolbar, setShowToolbar] = useState(false);
  const [filteredKeywords, setFilteredKeywords] = useState([]);
  const toolbarRef = useRef(null);

  const querySearchValue = (val) => {
    setShowToolbar(false);
    router.push(`?search=${val}`);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (toolbarRef.current && !toolbarRef.current.contains(event.target)) {
        setShowToolbar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [toolbarRef]);

  useEffect(() => {
    if (searchValue) {
      setShowToolbar(true);
      // 过滤关键字
      const filtered = keywords.filter((keyword) =>
        keyword.label_name.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredKeywords(filtered);
    } else {
      setShowToolbar(false);
      setFilteredKeywords([]);
    }
  }, [searchValue, keywords]);

  return (
    <div className="relative flex items-center w-full max-w-[500px]">
      <Input
        classNames={{
          base: "max-w-full sm:max-w-[50rem] h-10",
          mainWrapper: "h-full",
          inputWrapper:
            "h-full font-normal text-default-500 bg-white shadow-none",
        }}
        onChange={(e) => setSearchValue(e.target.value)}
        value={searchValue}
        placeholder="Type to search..."
        size="sm"
        startContent={<HiMagnifyingGlass size={20} />}
        type="search"
      />

      {showToolbar && (
        <div ref={toolbarRef} className={styles.toolbar_view}>
          <Listbox
            variant="flat"
            aria-label="Listbox menu with sections"
            className="w-full max-h-[300px] overflow-y-auto"
          >
            {filteredKeywords?.map((keyword) => (
              <ListboxItem
                key={keyword.id}
                href={"/product/" + keyword.id}
                onClick={() => setShowToolbar(false)}
                startContent={<TbHash color={keyword.color} />}
              >
                {keyword.label_name}
              </ListboxItem>
            ))}
          </Listbox>
          <div
            className={styles.toolbar_view_bottom}
            onClick={() => querySearchValue(searchValue)}
          >
            <HiMagnifyingGlass size={20} className="m-4" />
            Search for &quot;{searchValue}&quot;
          </div>
        </div>
      )}
    </div>
  );
}
