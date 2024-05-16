"use client";
import { Pagination } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSortStore } from "./product-btnGroup";
export default function ProductPagination({
  inintPage,
  total,
}: {
  inintPage: number;
  total: number;
}) {
  const router = useRouter();
  const [pageNum, setPageNum] = useState<number>(inintPage);

  const sortType = useSortStore((state: any) => state.sortType);

  const handlePageChange = (pageNumber: number) => {
    setPageNum(pageNumber);
    if (sortType) {
      router.push(`?sort=${sortType}&page=${pageNumber}`);
    } else {
      router.push(`?page=${pageNumber}`);
    }
  };

  useEffect(() => {
    if (sortType) {
      setPageNum(1);
    }
  }, [sortType]);
  return (
    <Pagination
      showControls
      total={total}
      page={pageNum}
      initialPage={pageNum}
      onChange={(v) => handlePageChange(v)}
    />
  );
}
