// pages/NewMapPage.tsx
"use client";
import styles from "@/styles/canvas/ViewTopTool.module.css";
import {
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Slider,
  Switch,
} from "@nextui-org/react";
import {
  TbCaretDownFilled,
  TbChevronRight,
  TbCode,
  TbDownload,
  TbEye,
  TbHelpCircle,
} from "react-icons/tb";
import { useBaseStore, useEditMapStore } from "../SocketManager";
import { LiLandsBoxSvg } from "@/components/utils/icons";
import { handleExport } from "@/components/utils/ExcelUtil";
import ModelTool from "./model/Model_Tool";
import ModelPopUp from "@/components/utils/ModelPopUp";

export default function TopToolView() {
  const [model, setModel, landInfo, canSave, isSaveing, setIsSaveing] =
    useBaseStore((state: any) => [
      state.model,
      state.setModel,
      state.landInfo,
      state.canSave,
      state.isSaveing,
      state.setIsSaveing,
    ]);

  const [pixelBlocks, setPixelBlocks] = useEditMapStore((state: any) => [
    state.pixelBlocks,
    state.setPixelBlocks,
  ]);

  return (
    <div className={styles["top-view"]}>
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center h-full text-[12px] ">
          <Breadcrumbs
            separator={<TbChevronRight size={12} color="#808e9a" />}
            itemClasses={{
              separator: "px-2",
            }}
          >
            <BreadcrumbItem>
              <span className="text-[12px]">主世界</span>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <Dropdown>
                <DropdownTrigger>
                  <div className="flex items-center gap-1 py-1 px-2 rounded-md hover:bg-[#f3f6f8] text-[12px] text-[#808e9a]">
                    {landInfo.land_name}
                    <TbCaretDownFilled size={12} color="#808e9a" />
                  </div>
                </DropdownTrigger>
                <DropdownMenu aria-label="Routes">
                  <DropdownItem href="#song-1">更改名称</DropdownItem>
                  <DropdownItem href="#song2">升级扩展</DropdownItem>
                  <DropdownItem href="#song3">删除</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </BreadcrumbItem>
          </Breadcrumbs>
        </div>

        <div className="flex items-center h-full">
          <div className="px-4 ">
            <div className="flex items-center justify-center gap-2 text-[#808e9a] text-xs w-full  ">
              <LiLandsBoxSvg width={12} height={12} />
              <p className="flex items-center gap-1 whitespace-nowrap">
                里土块 <TbHelpCircle size={14} />
              </p>

              <Slider
                aria-label="Player progress"
                hideThumb={true}
                value={landInfo.used_pixel_blocks}
                maxValue={landInfo.capacity_size}
                className="max-w-md"
                isDisabled
                classNames={{
                  base: "max-w-md w-[100px] gap-3",
                  filler: "bg-[#77a6d5] ",
                }}
              />
              <p className="flex items-center gap-1 whitespace-nowrap">
                {landInfo.used_pixel_blocks}/{landInfo.capacity_size}
              </p>
            </div>
          </div>
          <Divider orientation="vertical" />
          <div className="flex items-center pl-4">
            <Switch
              tabIndex={-1} // 使元素可以聚焦
              style={{ outline: "none" }}
              data-focus
              isSelected={model === "EDIT"}
              onValueChange={() => {
                (document.activeElement as HTMLInputElement)?.blur();
                setModel(model === "EDIT" ? "OBSERVE" : "EDIT");
              }}
              aria-label="model-switch"
              thumbIcon={({ isSelected, className }) =>
                isSelected ? (
                  <TbCode className={className} />
                ) : (
                  <TbEye className={className} />
                )
              }
            />
          </div>

          <div className="flex items-center px-4">
            <ModelPopUp
              title="下载确认"
              message="是否导出当前像素块数据？"
              onConfirm={() => {
                const currentDate = new Date();
                const formattedDate = currentDate
                  .toISOString()
                  .slice(0, 10)
                  .replace(/-/g, "");
                handleExport(
                  pixelBlocks,
                  `${landInfo.land_name}_${formattedDate}`
                );
              }}
              triggerContent={
                <div className="flex items-center justify-center w-[38px] h-[38px] rounded-full hover:bg-[#f3f6f8] text-[#4c5863] mr-1">
                  <TbDownload size={24} strokeWidth={1.1} />
                </div>
              }
            />
            <ModelTool />
          </div>
          <div className="px-2">
            <Button
              size="sm"
              color="primary"
              isLoading={isSaveing}
              isDisabled={!canSave}
              onClick={() => setIsSaveing(true)}
            >
              保存
            </Button>
          </div>

          {/* <div className="flex items-center px-4">
            <div className="flex items-center justify-center w-[38px] h-[38px] mr-1 rounded-full hover:bg-[#f3f6f8] text-[#4c5863]">
              <TbHelp size={24} strokeWidth={1.1} />
            </div>

            <Popover placement="bottom-end" showArrow={true}>
              <PopoverTrigger>
                <div className="flex items-center justify-center w-[38px] h-[38px] mr-1 rounded-full hover:bg-[#f3f6f8] text-[#4c5863]">
                  <TbBell size={24} strokeWidth={1.1} />
                </div>
              </PopoverTrigger>
              <PopoverContent>
                <div className=" overflow-auto max-h-[300px] px-2">
                  <NotificationList />
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <div className="flex items-center">
                <Avatar
                  size="sm"
                  as="button"
                  isBordered
                  className="transition-transform  cursor-pointer "
                  src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                />
                <TbChevronDown className="ml-2 text-default-500" />
              </div>
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">zoey@example.com</p>
              </DropdownItem>
              <DropdownItem key="settings">My Settings</DropdownItem>
              <DropdownItem key="team_settings">Team Settings</DropdownItem>
              <DropdownItem key="analytics">Analytics</DropdownItem>
              <DropdownItem key="system">System</DropdownItem>
              <DropdownItem key="configurations">Configurations</DropdownItem>
              <DropdownItem key="help_and_feedback">
                Help & Feedback
              </DropdownItem>
              <DropdownItem key="logout" color="danger">
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown> */}
        </div>
      </div>
    </div>
  );
}
