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
  TbDotsVertical,
  TbEdit,
  TbLink,
  TbMapPin,
  TbPencil,
  TbShare,
  TbTrash,
} from "react-icons/tb";
// ViewSwitcher 组件
const MyLandDataTable = ({ lands }: { lands: any }) => {
  return (
    <TableShow
      dataList={lands}
      columns={[
        { uid: "land", name: "土块" },
        { uid: "land_level", name: "land_level" },
        { uid: "land_type", name: "land_type" },
        { uid: "actions", name: "Actions" },
      ]}
      customRenderers={{
        land: (data) => (
          <div className="flex items-center text-[14px]">
            <div className="min-w-[64px] min-h-[64px] max-w-[64px] max-h-[64px] border border hover:border-[#006fef] p-1 m-1 overflow-hidden">
              <Image
                width={64}
                height={64}
                alt="Pixel block Image"
                src={data.cover_icon_url || "/images/DefPixel.png"}
                className="object-cover rounded-sm"
              />
            </div>
            <div className="flex flex-col px-2">
              <span className="text-[16px] font-semibold">
                {data.land_name}
              </span>
              <div className="text-[#606060] text-[12px] flex items-center gap-1">
                <TbMapPin size={14} />
                {data.world_coordinates_x}，{data.world_coordinates_y}
              </div>
            </div>
          </div>
        ),
        actions: (land) => (
          <Dropdown radius="sm">
            <DropdownTrigger>
              <Button
                radius="full"
                size="sm"
                isIconOnly
                variant="light"
                startContent={<TbDotsVertical size={20} color="#20272c" />}
              />
            </DropdownTrigger>
            <DropdownMenu
              className="text-[#3d4852]"
              variant="faded"
              aria-label="Dropdown menu with description"
            >
              <DropdownItem key="TbEdit" startContent={<TbPencil size={20} />}>
                Rename
              </DropdownItem>
              <DropdownItem
                key="TbEdit"
                href={`/landInfo/${land.id}`}
                startContent={<TbEdit size={20} />}
              >
                Edit Lands
              </DropdownItem>
              <DropdownItem key="TbShare" startContent={<TbShare size={20} />}>
                Share
              </DropdownItem>
              <DropdownItem
                key="CopyShareLink"
                showDivider
                startContent={<TbLink size={20} />}
              >
                Copy share link
              </DropdownItem>

              <DropdownItem
                key="delete"
                className="text-danger"
                color="danger"
                startContent={<TbTrash size={20} />}
              >
                Delete land
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ),
        coordinates: (data) =>
          `${data.world_coordinates_x}, ${data.world_coordinates_y}`,
      }}
    />
  );
};

export default MyLandDataTable;
