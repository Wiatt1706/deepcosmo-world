"use client";
import { BlockCoinsSvg, LandsBoxSvg, LogoSvg } from "../utils/icons";
import {
  TbArrowLeft,
  TbBell,
  TbChartBar,
  TbChevronDown,
  TbChevronsLeft,
  TbChevronsRight,
  TbEdit,
  TbInfoCircle,
  TbInfoSmall,
  TbMessageQuestion,
  TbSettings,
  TbTools,
} from "react-icons/tb";
import { useState } from "react";
import { Link } from "@nextui-org/link";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  Slider,
  User,
} from "@nextui-org/react";
import styles from "@/components/layout/menu-left.module.css";
export default function LandInfoMenu({ landInfo }: { landInfo: any }) {
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
            src="https://3-map.sandbox.game/beta/3/0/-6"
          />
        </div>
        <div className="flex flex-col p-2 text-[15px]">
          <p className=" font-bold">我的土块</p>
          <p className="text-[#606060] text-[12px]">{landInfo.land_name}</p>
        </div>

        <Link href="/ai" color="foreground" className={styles.menuItemActive}>
          <TbEdit size={20} className="mx-4" />
          详细信息
        </Link>
        <Link href="/ai" color="foreground" className={styles.menuItem}>
          <TbChartBar size={20} className="mx-4" />
          数据分析
        </Link>
        <Link href="/ai" color="foreground" className={styles.menuItem}>
          <TbTools size={20} className="mx-4" />
          编辑器
        </Link>
      </div>
      <div className=" absolute bottom-0 w-full border-t ">
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
