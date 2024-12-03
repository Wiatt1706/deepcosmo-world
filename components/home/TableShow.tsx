"use client";
import React, { useState, useCallback, useMemo, Key, ChangeEvent } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Pagination,
  Selection,
  SortDescriptor,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { statusOptions } from "./data";
import { TbChevronDown, TbPlus, TbSearch } from "react-icons/tb";
import { capitalize } from "../utils/Utils";

interface Columns {
  uid: string;
  name: string;
  sortable?: boolean | undefined;
}
export default function TableShow({
  dataList,
  columns,
  initVisibleColumns,
  customRenderers = {},
  className,
  actionControls = [], // 动态传入的操作控件
}: {
  dataList: any;
  columns: Columns[];
  initVisibleColumns?: string[];
  customRenderers?: {
    [key: string]: (data: any, columnKey: Key) => React.ReactNode;
  };
  className?: string;
  actionControls?: React.ReactNode[]; // 动态传入的控件列表
}) {
  type DataLiat = (typeof dataList)[0];

  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(
      initVisibleColumns?.length
        ? initVisibleColumns
        : columns.map((c) => c.uid)
    )
  );
  const [statusFilter, setStatusFilter] = useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "age",
    direction: "ascending",
  });

  const [page, setPage] = useState(1);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredDatas = [...dataList];

    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredDatas = filteredDatas.filter((item) =>
        Array.from(statusFilter).includes(item.status)
      );
    }

    return filteredDatas;
  }, [dataList, filterValue, statusFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a: DataLiat, b: DataLiat) => {
      const first = a[sortDescriptor.column as keyof DataLiat] as number;
      const second = b[sortDescriptor.column as keyof DataLiat] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = useCallback(
    (item: any, columnKey: Key) => {
      // 检查是否有自定义渲染逻辑
      if (customRenderers[columnKey]) {
        return customRenderers[columnKey](item, columnKey);
      }
      // 默认渲染逻辑
      const cellValue = item[columnKey];
      return cellValue;
    },
    [customRenderers]
  );

  const onNextPage = useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        {/* 动态操作控件区域 */}
        <div className="flex flex-wrap gap-3 w-full justify-between">
          <Input
            isClearable
            className="w-full sm:max-w-[40%]"
            classNames={{
              label: "text-black/50 dark:text-white/90",
              input: ["text-black/90 dark:text-white/90"],
              innerWrapper: "bg-transparent",
              inputWrapper: [
                "bg-white",
                "backdrop-blur-xl",
                "backdrop-saturate-200",
                "hover:bg-white/40",
                "group-data-[focus=true]:bg-white",
                "!cursor-text",
              ],
            }}
            size="sm"
            placeholder="Search by name..."
            startContent={<TbSearch size={20} className="text-default-300" />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          {actionControls.map((control, index) => (
            <div
              key={index}
              className="flex-grow min-w-[98px] max-w-[168px] basis-[calc(33.333%-1rem)]"
            >
              {control}
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {dataList.length} users
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    dataList.length,
  ]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${filteredItems.length} selected`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Previous
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, items.length, page, pages]);

  return (
    <Table
      aria-label="Example table with custom cells, pagination and sorting"
      bottomContent={bottomContent}
      shadow="none"
      selectedKeys={selectedKeys}
      selectionMode="single"
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      onSelectionChange={setSelectedKeys}
      onSortChange={setSortDescriptor}
      topContentPlacement="outside"
      bottomContentPlacement="outside"
      classNames={{
        wrapper: "p-4",
      }}
      className={className}
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={"No users found"} items={sortedItems}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
