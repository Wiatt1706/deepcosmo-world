"use client";

import { Input } from "@nextui-org/input";
import { HiMagnifyingGlass } from "react-icons/hi2";

export default function SearchNav() {
  return (
    <div className="flex items-center px-2">
      <Input
        classNames={{
          base: "max-w-full sm:max-w-[50rem] h-10",
          mainWrapper: "h-full",
          inputWrapper:
            "h-full font-normal text-default-500 bg-white shadow-none",
        }}
        placeholder="Type to search..."
        size="sm"
        startContent={<HiMagnifyingGlass size={20} />}
        type="search"
      />
    </div>
  );
}
