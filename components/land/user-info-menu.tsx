"use client";
import { BlockCoinsSvg, LandsBoxSvg } from "../utils/icons";
import {
  TbBell,
  TbChevronDown,
  TbInfoCircle,
  TbMessageQuestion,
  TbSettings,
} from "react-icons/tb";
import Link from "next/link";
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
import { Session } from "@supabase/auth-helpers-nextjs";
import { usePathname } from "next/navigation"; // 使用 usePathname 获取当前路径
import { useUserDataContext } from "../UserProvider";

export default function UserInfoMenu({
  session,
}: {
  session?: Session | null;
}) {
  const userData = useUserDataContext(); // 使用上下文获取用户数据
  const pathname = usePathname(); // 获取当前的路由路径

  // 判断当前路径是否完全匹配
  const isActive = (path: string) => pathname === path;

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
                  src: userData?.avatar_url || "/images/DefPixel.png",
                }}
                className="transition-transform"
                description={userData?.username || "Guest"}
                name={userData?.username || "Unknown User"}
              />
              <TbChevronDown size={20} color="#808e9a" />
            </div>
          </DropdownTrigger>
          <DropdownMenu aria-label="User Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-bold">Signed in as</p>
              <p className="font-bold">{userData?.username || "Guest"}</p>
            </DropdownItem>
            <DropdownItem key="settings">My Settings</DropdownItem>
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

      <div className="px-3 pt-2 flex flex-col gap-2">
        {/* 如果激活状态，禁用点击 */}
        <Link
          href={isActive("/home") ? "" : "/home"} // 激活状态下不允许跳转
          color="foreground"
          passHref
          className={
            isActive("/home") ? styles.menuItemActive : styles.menuItem
          }
        >
          <div className="px-2">🎪</div>
          Dashboard
        </Link>

        <Link
          href={isActive("/home/profile") ? "" : "/home/profile"} // 激活状态下不允许跳转
          color="foreground"
          className={
            isActive("/home/profile") ? styles.menuItemActive : styles.menuItem
          }
        >
          <div className="px-2">🎄</div>
          Profile
        </Link>

        <Link
          href={isActive("/ai") ? "" : "/ai"} // 激活状态下不允许跳转
          color="foreground"
          className={isActive("/ai") ? styles.menuItemActive : styles.menuItem}
        >
          <div className="px-2">❤️</div>
          Collection
        </Link>
      </div>

      <div className="absolute bottom-0 w-full border-t">
        <div className="flex flex-col text-[#141618]">
          <div className="px-4 py-4 flex items-center justify-between border-b">
            <p className="flex items-center gap-1">
              Lands <TbInfoCircle size={16} />
            </p>
            <p className="flex items-center gap-1">
              {userData?.land_coins} <LandsBoxSvg width={16} height={16} />
            </p>
          </div>
          <div className="px-4 py-4 flex items-center justify-between border-b">
            <p className="flex items-center gap-1">
              BlockCoins
              <TbInfoCircle size={16} />
            </p>
            <p className="flex items-center gap-1">
              {userData?.block_coins} <BlockCoinsSvg width={16} height={16} />
            </p>
          </div>
        </div>
        <div className="px-4 py-2">
          <Slider
            aria-label="Player progress"
            hideThumb={true}
            defaultValue={20}
            className="max-w-md"
            isDisabled
            classNames={{
              base: "max-w-md gap-3",
              filler: "bg-[#808e9a]",
            }}
          />
          <div className="flex items-center justify-between text-[#808e9a] text-xs">
            <span>3/10 lands use</span>
            <div></div>
          </div>
        </div>
        <div className="px-4 py-4 flex items-center justify-between">
          <Link
            href={"/settings"}
            color="foreground"
            className={styles.menuItem}
          >
            <TbSettings size={20} className="mx-2" />
            设置
          </Link>
          <Link
            href={"/settings"}
            color="foreground"
            className={styles.menuItem}
          >
            <TbMessageQuestion size={20} className="mx-2" />
            反馈
          </Link>
        </div>
      </div>
    </>
  );
}
