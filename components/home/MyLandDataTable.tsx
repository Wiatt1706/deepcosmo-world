"use client";
import React, { useState } from "react";
import TableShow from "./TableShow";
import Link from "next/link";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  Select,
  SelectItem,
  Selection,
} from "@nextui-org/react";
import {
  TbChartBar,
  TbDotsVertical,
  TbEdit,
  TbLink,
  TbMapPin,
  TbPencil,
  TbShare,
  TbTools,
  TbTrash,
} from "react-icons/tb";
import DateComponent from "../utils/DateComponent";
import { LAND_LEVEL, LAND_TYPE } from "@/types/MapTypes";
import { statusOptions } from "./data";
// ViewSwitcher 组件
const MyLandDataTable = ({ lands }: { lands: any }) => {
  const [visibleColumns, setVisibleColumns] = useState<Selection>();
  const [statusFilter, setStatusFilter] = useState<Selection>("all");
  const [columns, setColumns] = useState([
    { uid: "land", name: "土块", sortable: true },
    { uid: "fill_color", name: "颜色" },
    { uid: "land_level", name: "land_level", sortable: true },
    { uid: "land_type", name: "land_type", sortable: true },
    { uid: "created_at", name: "日期", sortable: true },
    { uid: "actions", name: "Actions" },
  ]);
  return (
    <>
      <div className="title-h1">
        <h1 className="px-4 py-2">我的土块</h1>
      </div>

      <TableShow
        className="p-4 pb-8"
        dataList={lands}
        columns={columns}
        customRenderers={{
          land: (data) => (
            <div className="flex items-center text-[14px]">
              <div className="min-w-[54px] min-h-[54px] max-w-[54px] max-h-[54px] border border hover:border-[#006fef] p-1 m-1 overflow-hidden">
                <Image
                  width={54}
                  height={54}
                  alt="Pixel block Image"
                  src={data.cover_icon_url || "/images/DefPixel.png"}
                  className="object-cover rounded-sm"
                />
              </div>
              <div className="flex flex-col px-2">
                <span className="text-[14px] font-bold">{data.land_name}</span>
                <div className="text-[#606060] text-[12px] flex items-center gap-1">
                  <TbMapPin size={14} />
                  {data.world_coordinates_x}，{data.world_coordinates_y}
                </div>
              </div>
            </div>
          ),
          land_level: (data) => (
            <div className="text-[#606060] text-[12px]">
              {LAND_LEVEL[Number(data?.land_level || 0) - 1]?.label}
            </div>
          ),
          fill_color: (data) => (
            <div
              className={`w-[20px] h-[20px] border rounded-sm bg-[${data?.fill_color}]`}
            ></div>
          ),
          land_type: (data) => (
            <div className="text-[#606060] text-[12px]">
              {LAND_TYPE[Number(data?.land_type || 0)]?.label}
            </div>
          ),
          created_at: (data) => (
            <div className="text-[#606060] text-[12px]">
              <DateComponent
                dateString={data?.created_at}
                label=""
                dateFormat="yyyy-MM-dd HH:mm:ss"
              />
            </div>
          ),
          actions: (land) => (
            <div className="flex w-full justify-center space-x-6">
              <Link
                href={`/landInfo/${land.id}`}
                className="p-2 hover:bg-gray-200 rounded transition duration-300 ease-in-out"
              >
                <TbEdit size={18} className="text-gray-500" />
              </Link>
              <Link
                href={`/landInfo/${land.id}`}
                className="p-2 hover:bg-gray-200 rounded transition duration-300 ease-in-out"
              >
                <TbChartBar size={18} className="text-gray-500" />
              </Link>
              <Link
                href={`/landInfo/${land.id}/edit`}
                className="p-2 hover:bg-gray-200 rounded transition duration-300 ease-in-out"
              >
                <TbTools size={18} className="text-gray-500" />
              </Link>
            </div>
          ),
          coordinates: (data) =>
            `${data.world_coordinates_x}, ${data.world_coordinates_y}`,
        }}
        actionControls={[
          <Select
            key="status"
            label="状态"
            size="sm"
            selectedKeys={statusFilter}
            selectionMode="multiple"
            onSelectionChange={setStatusFilter}
          >
            {statusOptions.map((status) => (
              <SelectItem key={status.uid}>{status.name}</SelectItem>
            ))}
          </Select>,
          <Select
            key="columns"
            disallowEmptySelection
            label="Columns"
            size="sm"
            selectedKeys={visibleColumns}
            selectionMode="multiple"
            onSelectionChange={setVisibleColumns}
          >
            {columns.map((col) => (
              <SelectItem key={col.uid}>{col.name}</SelectItem>
            ))}
          </Select>,
        ]}
      />
    </>
  );
};

export default MyLandDataTable;
