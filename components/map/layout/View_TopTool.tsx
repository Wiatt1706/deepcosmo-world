// pages/NewMapPage.tsx
"use client";
import styles from "@/styles/canvas/ViewTopTool.module.css";
import {
  Avatar,
  Button,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Slider,
  Switch,
} from "@nextui-org/react";
import {
  TbBell,
  TbChevronDown,
  TbCode,
  TbDeviceFloppy,
  TbEye,
  TbGeometry,
  TbHelp,
  TbHelpCircle,
  TbUpload,
} from "react-icons/tb";
import { useBaseStore } from "../SocketManager";
import { NotificationList } from "@/components/utils/NotificationBar";
import { LiLandsBoxSvg } from "@/components/utils/icons";

export default function TopToolView() {
  const [model, setModel, landInfo] = useBaseStore((state: any) => [
    state.model,
    state.setModel,
    state.landInfo,
  ]);

  return (
    <div className={styles["top-view"]}>
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center h-full ">
          <div className="px-2 ">
            <div className="flex items-center justify-center gap-2 text-[#808e9a] text-xs w-[220px]  ">
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
              <p className="flex items-center gap-1">
                {landInfo.used_pixel_blocks}/{landInfo.capacity_size}
              </p>
              <LiLandsBoxSvg width={14} height={14} />
            </div>
          </div>
        </div>

        <div className="flex items-center h-full">
          <div className="flex items-center pl-4">
            <Switch
              size="sm"
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
            <div className="flex items-center justify-center w-[38px] h-[38px] rounded-full hover:bg-[#f3f6f8] text-[#4c5863] mr-1">
              <TbUpload size={24} strokeWidth={1.1} />
            </div>
            <div className="flex items-center justify-center w-[38px] h-[38px] rounded-full hover:bg-[#f3f6f8] text-[#4c5863]">
              <TbGeometry size={24} strokeWidth={1.1} />
            </div>
          </div>
          <Divider orientation="vertical" />
          <div className="flex items-center px-4">
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
          </Dropdown>
        </div>
      </div>
    </div>
  );
}
