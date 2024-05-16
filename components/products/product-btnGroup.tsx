"use client";
import { Button, ButtonGroup, Pagination } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { TbSparkles, TbStarFilled, TbTrendingUp } from "react-icons/tb";
import { create } from "zustand";

export const useSortStore = create((set) => ({
  sortType: null,
  setSortType: (sortType: string) => set({ sortType }),
}));

export default function ProductBtnGroup({
  sort = "featured",
}: {
  sort: string | null;
}) {
  const router = useRouter();

  const setSortType = useSortStore((state: any) => state.setSortType);

  const handleChange = (val: string) => {
    setSortType(val);
    router.push(`?sort=${val}`);
  };

  return (
    <ButtonGroup variant="light" className="overflow-hidden">
      <Button
        onClick={() => handleChange("featured")}
        color={sort === "featured" ? "primary" : "default"}
        startContent={<TbStarFilled size={20} />}
      >
        默认
      </Button>
      <Button
        onClick={() => handleChange("popular")}
        color={sort === "popular" ? "primary" : "default"}
        startContent={<TbTrendingUp size={20} />}
      >
        热度
      </Button>
      <Button
        onClick={() => handleChange("new")}
        color={sort === "new" ? "primary" : "default"}
        startContent={<TbSparkles size={20} />}
      >
        最新
      </Button>
    </ButtonGroup>
  );
}
