"use client";
import { BlockCoinsSvg, LandsBoxSvg, LogoSvg } from "../utils/icons";
import {
  TbBell,
  TbChevronDown,
  TbInfoCircle,
  TbMessageQuestion,
  TbSettings,
} from "react-icons/tb";
import { Link } from "@nextui-org/link";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Slider,
  User,
} from "@nextui-org/react";
import styles from "@/components/layout/menu-left.module.css";
export default function UserInfoMenu() {
  return (
    <>
      <div className="flex items-center justify-between px-4 pt-4">
        <Dropdown placement="bottom-start">
          <DropdownTrigger>
            <div className="flex items-center gap-2 p-2 rounded-md hover:bg-[#f3f6f8]">
              <User
                as="button"
                avatarProps={{
                  isBordered: true,
                  src: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
                }}
                className="transition-transform"
                description="@tonyreichert"
                name="Tony Reichert"
              />
              <TbChevronDown size={20} color="#808e9a" />
            </div>
          </DropdownTrigger>
          <DropdownMenu aria-label="User Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-bold">Signed in as</p>
              <p className="font-bold">@tonyreichert</p>
            </DropdownItem>
            <DropdownItem key="settings">My Settings</DropdownItem>
            <DropdownItem key="team_settings">Team Settings</DropdownItem>
            <DropdownItem key="analytics">Analytics</DropdownItem>
            <DropdownItem key="system">System</DropdownItem>
            <DropdownItem key="configurations">Configurations</DropdownItem>
            <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
            <DropdownItem key="logout" color="danger">
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <Button
          size="sm"
          isIconOnly
          variant="light"
          startContent={<TbBell size={24} color="#808e9a" strokeWidth="1" />}
        />
      </div>

      <div className="px-3 pb-2">
        <div className={styles.menuItemLight}>Task Center 🎯</div>
      </div>
      <hr />
      <div className="px-3 pt-2 flex flex-col gap-2">
        <Link color="foreground" className={styles.menuItemActive}>
          <div className="px-2">🎪</div>
          Dashboard
        </Link>

        <Link href="/ai" color="foreground" className={styles.menuItem}>
          <div className="px-2">❤️</div>
          Collection
        </Link>

      </div>
      <div className=" absolute bottom-0 w-full border-t ">
        <div className=" flex flex-col text-[#141618]">
          <div className="px-4 py-4 flex items-center justify-between border-b">
            <p className="flex items-center gap-1">
              Lands <TbInfoCircle size={16} />
            </p>
            <p className="flex items-center gap-1">
              55 <LandsBoxSvg width={16} height={16} />
            </p>
          </div>
          <div className="px-4 py-4 flex items-center justify-between border-b ">
            <p className="flex items-center gap-1">
              BlockCoins
              <TbInfoCircle size={16} />
            </p>
            <p className="flex items-center gap-1">
              1521 <BlockCoinsSvg width={16} height={16} />
            </p>
          </div>
        </div>
        <div className="px-4 py-2 ">
          <Slider
            aria-label="Player progress"
            hideThumb={true}
            defaultValue={20}
            className="max-w-md"
            isDisabled
            classNames={{
              base: "max-w-md gap-3",
              filler: "bg-[#808e9a] ",
            }}
          />
          <div className="flex items-center justify-between text-[#808e9a] text-xs">
            <span>3/10 lands use</span>
            <div></div>
          </div>
        </div>
        <div className="px-4 py-4 flex items-center justify-between">
          <Link color="foreground" className={styles.menuItem}>
            <TbSettings size={20} className="mx-2" />
            设置
          </Link>
          <Link color="foreground" className={styles.menuItem}>
            <TbMessageQuestion size={20} className="mx-2" />
            反馈
          </Link>
        </div>
      </div>
    </>
  );
}
