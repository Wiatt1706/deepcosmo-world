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
  cn,
} from "@nextui-org/react";
import {
  TbBell,
  TbCaretDown,
  TbCaretDownFilled,
  TbChevronDown,
  TbDownload,
  TbEdit,
  TbHelp,
  TbPhoto,
  TbPhotoAi,
  TbTrash,
  TbUpload,
} from "react-icons/tb";

export default function TopToolView() {
  const iconClasses =
    "text-xl text-default-500 pointer-events-none flex-shrink-0";

  return (
    <div className={styles["top-view"]}>
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center h-full ">
          <Dropdown placement="bottom-end" radius="sm">
            <DropdownTrigger>
              <Button
                size="sm"
                variant="light"
                endContent={<TbCaretDownFilled />}
              >
                TestWorld
              </Button>
            </DropdownTrigger>
            <DropdownMenu variant="faded" aria-label="name dropdownMenu">
              <DropdownSection showDivider>
                <DropdownItem
                  key="new"
                  shortcut="⌘N"
                  startContent={<TbEdit className={iconClasses} />}
                >
                  重命名
                </DropdownItem>
                <DropdownItem
                  key="copy"
                  shortcut="⌘C"
                  startContent={<TbPhoto className={iconClasses} />}
                >
                  设置封面
                </DropdownItem>
              </DropdownSection>

              <DropdownItem
                key="delete"
                className="text-danger"
                color="danger"
                shortcut="⌘⇧D"
                startContent={
                  <TbTrash className={cn(iconClasses, "text-danger")} />
                }
              >
                删除地块
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>

        <div className="flex items-center h-full">
          <div className="flex items-center px-4">
            <div className="flex items-center justify-center w-[38px] h-[38px] rounded-full hover:bg-[#f3f6f8] text-[#4c5863]">
              <TbUpload size={24} strokeWidth={1.1} />
            </div>
            <div className="flex items-center justify-center w-[38px] h-[38px] rounded-full hover:bg-[#f3f6f8] text-[#4c5863]">
              <TbDownload size={24} strokeWidth={1.1} />
            </div>
          </div>
          <Divider orientation="vertical" />
          <div className="flex items-center px-4">
            <div className="flex items-center justify-center w-[38px] h-[38px] mr-1 rounded-full hover:bg-[#f3f6f8] text-[#4c5863]">
              <TbHelp size={24} strokeWidth={1.1} />
            </div>
            <div className="flex items-center justify-center w-[38px] h-[38px] mr-1 rounded-full hover:bg-[#f3f6f8] text-[#4c5863]">
              <TbBell size={24} strokeWidth={1.1} />
            </div>
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