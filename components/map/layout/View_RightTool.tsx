"use client";
import styles from "@/styles/canvas/ViewRightTool.module.css";
import {
  Button,
  Chip,
  ChipProps,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Selection,
  SortDescriptor,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { clsx } from "clsx";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  TbCaretDownFilled,
  TbDotsVertical,
  TbPlus,
  TbSearch,
  TbX,
} from "react-icons/tb";
import { useEditMapStore } from "../SocketManager";
import { PixelBlock } from "@/types/MapTypes";
const statusColorMap: Record<number, ChipProps["color"]> = {
  0: "success",
  1: "danger",
  2: "warning",
};

const columns: {
  key: string;
  name: string;
  sortable?: boolean;
  align?: "start" | "center" | "end";
}[] = [
  {
    key: "position",
    sortable: true,
    name: "位置",
  },
  {
    key: "size",
    sortable: true,
    name: "Size",
  },
  {
    key: "status",
    sortable: true,
    name: "状态",
    align: "end",
  },
  {
    key: "actions",
    name: "",
    align: "end",
  },
];

export default function RightToolView({
  isRightAct,
  setIsRightAct,
}: {
  isRightAct: boolean;
  setIsRightAct: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [pixelBlocks, setPixelBlocks] = useEditMapStore((state: any) => [
    state.pixelBlocks,
    state.setPixelBlocks,
  ]);

  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));

  const [statusFilter, setStatusFilter] = useState<Selection>("all");

  const [displayedItems, setDisplayedItems] = useState<PixelBlock[]>([]);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDisplayedItems(pixelBlocks.slice(0, 20));
  }, [pixelBlocks]);

  const handleScroll = () => {
    console.log("handleScroll");

    if (tableContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        tableContainerRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 5) {
        setDisplayedItems((prev) => [
          ...prev,
          ...pixelBlocks.slice(prev.length, prev.length + 20),
        ]);
      }
    }
  };

  const hasSearchFilter = Boolean(filterValue);

  const filteredItems = useMemo(() => {
    let filteredItems = [...displayedItems];

    if (hasSearchFilter) {
      filteredItems = filteredItems.filter((value: PixelBlock) =>
        value.name?.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    if (statusFilter !== "all") {
      filteredItems = filteredItems.filter((value: PixelBlock) =>
        Array.from(statusFilter).includes(value.status || 0)
      );
    }

    return filteredItems;
  }, [displayedItems, filterValue, statusFilter]);

  const renderCell = useCallback((value: PixelBlock, columnKey: React.Key) => {
    const cellValue = value[columnKey as keyof PixelBlock] as string;

    switch (columnKey) {
      case "position":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{cellValue}</p>
            <p className="text-bold text-tiny capitalize text-default-500">
              {value.x + "," + value.y}
            </p>
          </div>
        );
      case "size":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{cellValue}</p>
            <p className="text-bold text-tiny capitalize text-default-500">
              {value.width + "x" + value.height}
            </p>
          </div>
        );
      case "status":
        return (
          <Chip
            className="capitalize border-none gap-1 text-default-600"
            color={statusColorMap[value.status || 0] || "default"}
            size="sm"
            variant="dot"
          ></Chip>
        );
      case "actions":
        return (
          <div className="relative flex justify-end items-right gap-2">
            <Dropdown className="bg-background border-1 border-default-200">
              <DropdownTrigger>
                <Button isIconOnly radius="full" size="sm" variant="light">
                  <TbDotsVertical className="text-default-400" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem>View</DropdownItem>
                <DropdownItem>Edit</DropdownItem>
                <DropdownItem>Delete</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
    } else {
      setFilterValue("");
    }
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex justify-between gap-3 items-end mb-2">
        <Input
          isClearable
          classNames={{
            inputWrapper: "border-1 h-[32px] border-default-200 bg-[#fff]",
          }}
          placeholder="Search by name..."
          size="sm"
          startContent={<TbSearch className="text-default-300" />}
          value={filterValue}
          variant="bordered"
          onClear={() => setFilterValue("")}
          onValueChange={onSearchChange}
        />
        <div className="flex gap-3">
          <Button
            className="bg-foreground text-background"
            endContent={<TbPlus />}
            size="sm"
          >
            Add New
          </Button>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    onSearchChange,
    pixelBlocks.length,
    hasSearchFilter,
  ]);

  const classNames = useMemo(
    () => ({
      base: "max-h-[382px] overflow-y-auto",
      th: ["text-default-500", "border-none", "rounded-none,", "bg-[#f3f6f8]"],
    }),
    []
  );

  return (
    <div className={styles["right-view"] + " shadow"}>
      <div className={styles["columnGgroup"]}>
        <div className={styles["colRow"]}>
          <div className="flex items-center justify-between p-4">
            <h4 className={clsx([styles["col"], styles["title"]])}>数据概览</h4>
            <TbX size={18} />
          </div>
          <div className=" px-4">
            <h4 className={clsx([styles["col"], styles["col-title"]])}>
              现存数据
              <TbCaretDownFilled size={18} className="ml-2" />
            </h4>

            <div className="bg-[#f3f6f8] rounded-2xl p-2">
              {topContent}
              <div className="flex justify-between gap-2 text-[#637171] px-2 py-1 font-semibold text-[12px] border-b">
                {columns.map((column) => (
                  <div
                    className="flex justify-between items-center"
                    key={column.key}
                  >
                    <p className=" capitalize">{column.name}</p>
                    <p className=" capitalize"></p>
                  </div>
                ))}
              </div>
              <Table
                ref={tableContainerRef}
                aria-label="pixel blocks"
                shadow="none"
                hideHeader
                removeWrapper
                selectionMode="multiple"
                selectionBehavior="replace"
                classNames={classNames}
                selectedKeys={selectedKeys}
                onSelectionChange={setSelectedKeys}
              >
                <TableHeader columns={columns}>
                  {(column) => (
                    <TableColumn
                      key={column.key}
                      align={column.align || "start"}
                      allowsSorting={column.sortable}
                    >
                      {column.name}
                    </TableColumn>
                  )}
                </TableHeader>
                <TableBody emptyContent={"No Data found"} items={filteredItems}>
                  {(item: PixelBlock) => (
                    <TableRow key={item.x + "-" + item.y}>
                      {(columnKey) => (
                        <TableCell>{renderCell(item, columnKey)}</TableCell>
                      )}
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
