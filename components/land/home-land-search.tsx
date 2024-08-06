"use client";
import { Input } from "@nextui-org/react";
import { useState } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { useRouter } from "next/navigation";
export default function HomeLandSearch() {
  const router = useRouter();

  const [searchValue, setSearchValue] = useState("");

  const handleSearch = () => {
    // 处理搜索逻辑
    router.push(`?search=${searchValue}`);
  };
  const handleKeyDown = (event:any) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };
  return (
    <div className="relative flex items-center w-full max-w-md  bg-white rounded border focus-within:ring-1">
      <HiMagnifyingGlass size={20} className="text-gray-500 ml-2" />
      <input
        onChange={(e) => setSearchValue(e.target.value)}
        value={searchValue}
        placeholder="Type to search..."
        type="search"
        className="w-full p-2 text-sm text-gray-700 placeholder-gray-400 border-none focus:outline-none focus:ring-0"
        onKeyDown={handleKeyDown}
      />
      {searchValue && (
        <button
          onClick={handleSearch}
          className="ml-2 px-4 py-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none"
        >
          Search
        </button>
      )}
    </div>
  );
}
