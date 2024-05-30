"use client";
import { Chip, Link, ScrollShadow } from "@nextui-org/react";
import { useEffect } from "react";
import { create } from "zustand";

export const useKeywordStore = create((set) => ({
  keywords: [],
  setKeywords: (keywords: Keyword[]) => set({ keywords }),
}));

export default function ProductKeyword({
  keywords,
  activeKeys,
}: {
  keywords: Keyword[] | null;
  activeKeys: string[] | null;
}) {
  const setKeywords = useKeywordStore((state: any) => state.setKeywords);

  useEffect(() => {
    setKeywords(keywords);
  }, [keywords]);

  const sortedKeywords = keywords
    ? [...keywords].sort(
        (a, b) =>
          (activeKeys?.includes(String(b.id)) ? 1 : 0) -
            (activeKeys?.includes(String(a.id)) ? 1 : 0) || a.id - b.id
      )
    : null;

  return (
    <ScrollShadow hideScrollBar orientation="horizontal">
      <div className="flex gap-2 flex-grow-0">
        <Chip href={"/"} as={Link} color="default">
          ALL
        </Chip>
        {sortedKeywords?.map((keyword: Keyword) => (
          <Chip
            variant="light"
            key={keyword.id}
            className="cursor-pointer hover:bg-gray-200"
            href={"/product/" + keyword.id}
            as={Link}
          >
            #{keyword.label_name}
          </Chip>
        ))}
      </div>
    </ScrollShadow>
  );
}
