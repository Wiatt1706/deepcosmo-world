"use client";
import React from "react";
import TableShow from "./TableShow";
import Link from "next/link";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
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
// ViewSwitcher 组件
const MyLandDataTable = ({ lands }: { lands: any }) => {
  return (
    <>
      <div className="title-h1">
        <h1 className="px-2 py-4">我的土块</h1>
      </div>

      <TableShow
        className="p-4 pb-8"
        dataList={lands}
        columns={[
          { uid: "land", name: "土块", sortable: true },
          { uid: "fill_color", name: "颜色" },
          { uid: "land_level", name: "land_level", sortable: true },
          { uid: "land_type", name: "land_type", sortable: true },
          { uid: "created_at", name: "日期", sortable: true },
          { uid: "actions", name: "Actions" },
        ]}
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
              <div className="p-2 hover:bg-gray-200 rounded transition duration-300 ease-in-out">
                <TbEdit size={20} className="text-gray-400" />
              </div>
              <div className="p-2 hover:bg-gray-200 rounded transition duration-300 ease-in-out">
                <TbChartBar size={20} className="text-gray-400" />
              </div>
              <div className="p-2 hover:bg-gray-200 rounded transition duration-300 ease-in-out">
                <TbTools size={20} className="text-gray-400" />
              </div>
            </div>
          ),
          coordinates: (data) =>
            `${data.world_coordinates_x}, ${data.world_coordinates_y}`,
        }}
      />
    </>
  );
};

export default MyLandDataTable;
