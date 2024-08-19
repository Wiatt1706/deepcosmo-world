"use client";
import {
  TbArrowLeft,
  TbChartBar,
  TbEdit,
  TbSettings,
  TbTools,
  TbMessageQuestion,
} from "react-icons/tb";
import { Image } from "@nextui-org/react";
import styles from "@/components/layout/menu-left.module.css";
import Link from "next/link";

export default function LandInfoMenu({
  landInfo,
  menuactive,
}: {
  landInfo: Land;
  menuactive?: string;
}) {
  // Default active item if menuactive is not provided
  const activeItem = menuactive || "detail";

  const MenuItem = ({
    href,
    label,
    icon: Icon,
    isActive,
  }: {
    href: string;
    label: string;
    icon: any;
    isActive: boolean;
  }) => {
    return isActive ? (
      <div
        className={`${styles.menuItem} ${styles.menuItemActive} flex items-center`}
      >
        <Icon size={20} className="mx-4" />
        {label}
      </div>
    ) : (
      <Link href={href} passHref color="foreground" className={styles.menuItem}>
        <Icon size={20} className="mx-4" />
        {label}
      </Link>
    );
  };

  return (
    <>
      <div className="px-3 pt-2 flex flex-col gap-2">
        <Link color="foreground" href="/home" className={styles.menuItem}>
          <TbArrowLeft size={20} className="mx-2" />
          个人中心
        </Link>

        <div className="hover:bg-[#f3f6f8] rounded-[8px] flex items-center justify-center p-[2px]">
          <Image
            width={90}
            radius="sm"
            alt="NextUI hero Image"
            src={`${landInfo?.cover_icon_url}`}
          />
        </div>
        <div className="flex flex-col p-2 text-[15px]">
          <p className="font-bold">我的土块</p>
          <p className="text-[#606060] text-[12px]">{landInfo.land_name}</p>
        </div>

        <MenuItem
          href={`/landInfo/${landInfo.id}`}
          label="详细信息"
          icon={TbEdit}
          isActive={activeItem === "detail"}
        />
        <MenuItem
          href="/ai"
          label="数据分析"
          icon={TbChartBar}
          isActive={activeItem === "data"}
        />
        <MenuItem
          href={`/landInfo/${landInfo.id}/edit`}
          label="编辑器"
          icon={TbTools}
          isActive={activeItem === "editor"}
        />
      </div>
      <div className="absolute bottom-0 w-full border-t">
        <div className="px-4 py-4 flex items-center justify-between">
          <MenuItem
            href="/settings"
            label="设置"
            icon={TbSettings}
            isActive={activeItem === "settings"}
          />
          <MenuItem
            href="/feedback"
            label="反馈"
            icon={TbMessageQuestion}
            isActive={activeItem === "feedback"}
          />
        </div>
      </div>
    </>
  );
}
